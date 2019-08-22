/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:00:00 2019
 * author: Rahul
 * Description: Electrone App MainWindow Process
 * 
 */

const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog

const path = require('path');
const url = require('url');
let interpreter;
let configs;

class mainProcess{
    constructor() {
        app.requestSingleInstanceLock();
        if ( ! app.hasSingleInstanceLock() ){
            console.log(" ............................................");
            console.log(" A Instance of The Application is running ...");
            console.log(" ............................................");
            app.quit(); 
        }
        app.setAppLogsPath(logpath);
        configs = require(path.join(__dirname,'config.js'));
        interpreter = new(require(path.join(__dirname,'locale','interpreter.js')));
    }

    createWindow(id){
        let window = new BrowserWindow(configs.getWindowCfgById(id));        
        window.loadURL(url.format({
                    pathname: path.join(__dirname,'index.html'),
                    protocol: 'file:',
                    slashes: true })
        }).then(()=>{
           if (config.debug){
                
           }
           window.setContentProtection(true);
           window.once('ready-to-show', () => {
            if (window.getTitle() !== 'Confirm-Window')
                window.show();
           });

           window.on('unresponsive', () => {
            console.log(" Ready To show catched");
           });

           window.on('closed', () => {
            console.log(" closed event catched");
            window = null;
           });

        window.webContents.on('did-fail-load', () => {
            loadPage(id);
        });
      
        window.webContents.on('crashed', () => {
            console.log('Your Ember app (or other code) in the main window has crashed.');
            console.log('This is a serious issue that needs to be handled and/or debugged.');
        });
      
        window.on('unresponsive', () => {
            console.log('Your Ember app (or other code) has made the window unresponsive.');
        });
      
        window.on('responsive', () => {
            console.log('The main window has become responsive again.');
        });
        
        return window;
    }).catch((err)=>{
       console.err(err);
     });
    }

    windowScheduler(scheduler_name,action_name,data={},window = null){
        //console.log(controller_name,action_name);
        let scheduler = this.callScheduler(scheduler_name,action_name,data);
        if(!window) {
            if (!window_main){
                window = this.getWindow();
            }else{
                window = window_main;
            }
        }
        console.log( 'scheduler.base_path: '+scheduler.base_path+' Action : '+action_name);
        let openWindow = ()=>{
            let html = 'data:text/html;charset=UTF-8,'+
                encodeURIComponent("<script>window.name='"+window.display_name+"';</script>\n"+scheduler.output);
                console.log( 'loading Window :'+window.display_name);
                window.loadURL(html,{
                baseURLForDataURL:url.format({
                    pathname: scheduler.html_path,
                    protocol: 'file:',
                    slashes: true })
            });
            if(configs.debug){
               if (configs.debugWindow == 'ALL'){  
                   window.openDevTools();
               }
               else if (configs.debugWindow == window.display_name) {
                   window.openDevTools();
               }
               else{
                   console.log('Debugger Disabled for Window Name : '+window.display_name );
               }
            }
        };

        if(scheduler.action_result instanceof  Promise){
            scheduler.action_result.then(()=>{
                openWindow();
            })
        }else{
            openWindow();
        }
    }

    callScheduler(scheduler_name, action_name, data={}, type="get"){
        let schedulerCls = require(path.join(__dirname,"resource",scheduler_name,"scheduler.js"));
        //console.log(scheduler_name);
        let scheduler = new schedulerCls(scheduler_name);
        scheduler._interpreter = interpreter;
        let action_func_name = "action"+action_name;
        scheduler.setActionName(action_name);
        //console.log(`action_name ${action_name}`);        
        scheduler.action_result = scheduler[action_func_name](data);
        if(scheduler.redirect_url){
            let {scheduler_name,action_name,query} = this.parseUrl(scheduler.redirect_url);
            scheduler = this.callScheduler(scheduler_name,action_name,query);
        }
        return scheduler
    } 

    run(){
        if(configs.debug){
            app.disableHardwareAcceleration();
        }
        
        app.on('ready', () => {
            if(BrowserWindow.fromId(1) == null){
                this.createWindow(1);
            }
        });

        ipcMain.on('window.open',(event, {id, parent_id}) => {            
            let currentWindow = BrowserWindow.fromId(id);
            if( currentWindow == null){
                this.createWindow(id);
            }else{
                currentWindow.show();
            }
        });

        ipcMain.on("$.ajax",(event,{url,data,type,requestId} )=>{
            let {controller_name,action_name,query} = this.parseUrl(url);
            console.log(controller_name, action_name);
            if(typeof data !== "object"){
                data = {};
            }
            Object.assign(data, query);
            let controller = this.loadController(controller_name,action_name,data,type);
            if(controller.action_result instanceof  Promise){
               controller.action_result.then(()=>{
               event.sender.send('$.ajax.response.'+requestId, {content:controller.output});
                    return true;
               })
            }else{
                event.sender.send('$.ajax.response.'+requestId, {content:controller.output})
            }
        });

        ipcMain.on('window.close',(event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if( currentWindow != null)
                currentWindow.close()
        });

        ipcMain.on('window.exist',(event,id)=>{
            let currentWindow = BrowserWindow.fromId(id);
            if( currentWindow != null)
                event.returnValue=true;
            else    
                event.returnValue=false; 
        });

        ipcMain.on('window.hide',(event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if( currentWindow != null)
                currentWindow.hide();
        });

        ipcMain.on('window.show',(event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if( currentWindow != null)
                currentWindow.show();
        });

        ipcMain.on('window.triggerEvent',(event,{eventName,targetWindow,args}) => {
            let currentWindow = BrowserWindow.fromId(id);
            if(currentWindow != null){
                currentWindow.webContents.send("window.addEventListener."+eventName,args);
            }
        });

        ipcMain.on('dialog.Show',(event,{id,requestId,eventName}) => {
            let currentWindow = BrowserWindow.fromId(id);
            if(currentWindow != null){
                dialog.showOpenDialog(win,config.getWindowCfgById(id),
                function (result) {
                    console.log(result);
                    currentWindow.webContents.send("window.addEventListener."+eventName,{requestId,result});
                });
            }            
        });

        app.on('quit',(event,exitCode)=>{
            console.log(` Application is going to be Exit with code ${exitCode}`);
        });

        app.on('gpu-process-crashed',(event,killed)=>{
            if (!killed){
                console.log(` GPU Process Crashed is going to be close the Application`);
                app.quit();
            }    
        });

        app.on('renderer-process-crashed',(event,{webcontent,killed})=>{
            if (!killed){
                console.log(` GPU Process Crashed is going to be close the Application`);
                app.quit();
            }
        });

        app.on('window-all-closed', () => {
            console.log(` window-all-closed event catched`);
            app.quit()
        })
    }
}

module.exports = mainProcess;
