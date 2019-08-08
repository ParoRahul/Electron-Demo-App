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
const Menu = electron.Menu
const dialog = electron.dialog

let appTray = null;
const path = require('path');
const url = require('url');
let interpreter;
let configs;
let windows = {};
let window_main;
let base_path = __dirname;
let appName = "Groot";

class mainProcess{
    static createDesktopApplication(configPath){
        configs = require(configPath);
        if(typeof configs.basePath === "string"){
            base_path = configs.basePath;
        }
        const menu = new Menu();
        Menu.setApplicationMenu(menu);
        interpreter = new(require(path.join(__dirname,'locale','interpreter.js')));
        appName = interpreter.__('app_name');
    }

    static app(){
        return new mainProcess();
    }

    createWindow(features,name=false,parent=null){
        let display_name = name;
        if(name === false){
            name = "root";
            display_name = "root";
        }
        features["icon"] = path.join(__dirname,'image','logo.png');
        if (!features["title"]) {
            features["title"] = appName;
        }
        let win = new BrowserWindow(features);
        win.display_name = display_name;
        windows[name] = win;
        if(parent != null){
            if(!parent._children){
                parent._children = [win];
            }else{
                parent._children.push(win);
            }
        }
        return win;
    }

    popWindow(name=false){
        if(name === false || name === "root"){
            name = "root";
        }else{
            name = name;
        }
        let win = windows[name];
        delete windows[name];
        return win;
    }

    closeWindow(name){
        let win = this.popWindow(name);
        if(win){
            if(win._children){
                for(let i=0;i<win._children.length;i++){
                    var child = win._children[i];
                    child = this.popWindow(child.display_name);
                    if(child){
                        child.close();
                    }
                }
            }
            win.close();
        }
        if(Object.keys(windows).length === 0){
            app.exit();
        }
    }

    getWindow(name=false){
        if(name === false || name === "root"){
            name = "root";
        }else{
            name = name;
        }
        return windows[name];
    }

    hideWindow(name){
        let win = this.getWindow(name);
        if(win){
            win.hide();
        }
    }

    showWindow(name,features){
        let win = this.getWindow(name);
        if(win){
            if(features && features.x>=0 && features.y>=0 ){
                win.setPosition(features.x,features.y);
            }
            win.show();
        }
    }

    parseUrl(url){
        let matches =/[\/\\]([^\/\\]+)[\\\/]([^\\\/?]+)(\?[^\/\\]+)?$/.exec(url);
        if(matches){
            let scheduler_name = matches[1];
            let action = matches[2];
            let query = {};
            if(matches.length == 4 && typeof matches[3] != "undefined"){
                let queries = matches[3].substr(1).split("&");
                for(let i in queries){
                    let q = queries[i];
                    let kv = q.split("=");
                    if(kv.length == 2 && kv[0] != ""){
                        query[kv[0]] = kv[1];
                    }
                }
            }
            return {"scheduler_name":scheduler_name,"action_name":action, "query":query};
        }
        return {};
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

    run(launch_win_opt){
        windows = {};
        if(configs.debug){
            app.disableHardwareAcceleration();
        }
        
        app.on('ready', () => {
            let default_scheduler = "init";
            let default_action = "Load";
            if(typeof this.getWindow() == "undefined"){
                this.createWindow(launch_win_opt);
            }
            this.windowScheduler(default_scheduler,default_action);
        });

        ipcMain.on('window.open',(event, {url, name, features, parent}) => {
            if(typeof features == "undefined"){
                features = {};
            }
            let currWin = this.getWindow(name);
            if(!currWin){
                let parent_window = this.getWindow(parent);
                if(typeof features["parent"] != "undefined"){
                    parent_window = null;
                }else if(features.modal == true){
                    features["parent"] = parent_window;
                }
                let {scheduler_name, action_name, query} = this.parseUrl(url);
                //console.log(controller_name, action_name);
                this.windowScheduler(scheduler_name,action_name,query,
                    this.createWindow(features,name,parent_window));
            }else{
                currWin.show();
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

        ipcMain.on('window.close',(event, name) => {
            this.closeWindow(name);
        });

        ipcMain.on('window.exist',(event,name)=>{
            let win = this.getWindow(name);
            event.returnValue=!!win;
        });

        ipcMain.on('window.hide',(event, name) => {
            this.hideWindow(name);
        });

        ipcMain.on('window.show',(event, {name,features}) => {
            this.showWindow(name,features);
        });

        ipcMain.on('window.triggerEvent',(event,{eventName,targetWindow,args}) => {
            let win = this.getWindow(targetWindow);
            if(win){
                win.webContents.send("window.addEventListener."+eventName,args);
            }
        });

        ipcMain.on('dialog.Show',(event,{name,features,requestId,eventName}) => {
            let win = this.getWindow(name);
            dialog.showOpenDialog(win,features,function (result) {
                console.log(result);
                win.webContents.send("window.addEventListener."+eventName,{requestId,result});
            });
        });
    }
}
module.exports = mainProcess;