/**
 * coding: utf-8 
 * Created on Fri Aug 20 01:15:00 AM 2019
 * author: Rahul
 * Description: Electrone App MainWindow Process
 * 
 */

const electron = require('electron');
const ipcMain = electron.ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const dialog = electron.dialog
/* require('electron-reload')(__dirname, {
    //Note that the path to electron may vary according to the main file
    electron: require(`${__dirname}/node_modules/electron`)
    });
*/
const path = require('path');
const url = require('url');
let interpreter;
let configs;
let windowList;

class mainProcess {
    constructor() {
        app.requestSingleInstanceLock();
        if (!app.hasSingleInstanceLock()) {
            console.log(" ............................................");
            console.log(" A Instance of The Application is running ...");
            console.log(" ............................................");
            app.quit();
        }
        
        configs = require(path.join(__dirname,'config','config.js'));
        app.setAppLogsPath(configs.logpath);
        interpreter = new(require(path.join(__dirname, 'locale', 'interpreter.js')));
        this.windowList = [];
    }

    getWindowIdByTitle(title) {
        let winObj = this.windowList.find(winObj => winObj.title == title);
        return winObj?winObj.id:0;
    }

    createWindow(winTitle) {
        return new Promise( function(resolve,reject){
            try{
                let window = new BrowserWindow(configs.getWindowCfgByTitle(winTitle));
                if ( window == null ){
                    throw new error(' Window is null') 
                }
                // Screen Shot Prevention 
                //window.setContentProtection(true);
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
                    console.log('Your Ember app (or other code) in the main window has crashed.');
                    console.log('This is a serious issue that needs to be handled and/or debugged.');
                    throw new Error('Window Loading Fail');
                });

                window.webContents.on('crashed', () => {
                    console.log('Your Ember app (or other code) in the main window has crashed.');
                    console.log('This is a serious issue that needs to be handled and/or debugged.');
                    throw new Error('Window Loading Fail');
                });

                window.on('unresponsive', () => {
                    console.log('Your Ember app (or other code) has made the window unresponsive.');
                });

                window.on('responsive', () => {
                    console.log('The main window has become responsive again.');
                });
                resolve(window);
            }
            catch(err) {
                reject(err);
            }
        });
    }

    loadPage(window) {
        if ( window == null ){
            console.error('Window object is null');
            throw new Error('Window object is null');
        }
        let option = configs.getWindowCfgByTitle(window.getTitle());
        /* console.log(`window.id ${window.getTitle()}`)
        console.log(option); */
        let schedulerCls = require(path.join(__dirname,option.pageDtls.scheduler,"scheduler.js"));
        let scheduler = new schedulerCls(option.pageDtls.scheduler);
        //console.log(` scheduler.base_path ${scheduler.base_path}`);
        scheduler._interpreter = interpreter;
        let action_func_name = "action" + option.pageDtls.task;
        scheduler.setActionName(option.pageDtls.task);
        scheduler.action_result = scheduler[action_func_name]({});
        //console.log(` scheduler.output ${scheduler.output}`);
        let html = 'data:text/html;charset=UTF-8,' +
            encodeURIComponent("<script>window.name='" + option.title + "';</script>\n" + scheduler.output);
        //let window = BrowserWindow.fromId(id);        
        window.loadURL(html, {
            baseURLForDataURL: url.format({
            pathname: scheduler.html_path,
            protocol: 'file:',
            slashes: true
            })
        }).then(()=>{
            if (configs.debug) {
                window.openDevTools();
            }
            this.windowList.push({'title':window.getTitle(),'id':window.id});
        }).catch((err)=>{
            console.error(err);
        });
    }

    run() {
        if (configs.debug) {
             app.disableHardwareAcceleration();
        }
        // Commant out thos line for windows low configuration
        // app.disableHardwareAcceleration();
        
        app.on('ready', () => {
            let initWinTitle = configs.initWindowtitle;
            console.log(`initWinTitle : ${initWinTitle}`);
            this.createWindow(initWinTitle).then((window)=>{
                this.loadPage(window);
            //}).then(()=>{    
            //    this.windowList.push({'title':initWinTitle,'id':window.id});
            }).catch((err)=>{
               console.log(err);
            })
        });

        ipcMain.on('window.open', (event, { windowTitle, parent_id }) => {
            let currentWindow = BrowserWindow.fromId(this.getWindowIdByTitle(windowTitle));
            if (currentWindow != null){
                currentWindow.show();
            }
            else{
                this.createWindow(windowTitle).then((window)=>{
                    this.loadPage(window)
                //}).then(()=>{
                //    this.windowList.push({'title':windowTitle,'id':window.id});
                }).catch((err)=>{
                    console.log(err)
                });                 
            }
        });

        ipcMain.on('window.close', (event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow != null)
                currentWindow.close()
        });

        ipcMain.on('window.exist', (event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow != null)
                event.returnValue = true;
            else
                event.returnValue = false;
        });

        ipcMain.on('window.hide', (event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow != null)
                currentWindow.hide();
        });

        ipcMain.on('window.show', (event, id) => {
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow != null)
                currentWindow.show();
        });

        ipcMain.on('window.triggerEvent', (event, { eventName, targetWindow, args }) => {
            let currentWindow = BrowserWindow.fromId(this.getWindowIdByTitle(windowTitle));
            if (currentWindow != null) {
                currentWindow.webContents.send("window.addEventListener." + eventName, args);
            }
        });

        ipcMain.on('dialog.Show', (event, { windowTitle, requestId, eventName }) => {
            let currentWindow = BrowserWindow.fromId(this.getWindowIdByTitle(windowTitle));
            if (currentWindow != null) {
                dialog.showOpenDialog(win, config.getWindowCfgById(id),
                    function(result) {
                        console.log(result);
                        currentWindow.webContents.send("window.addEventListener." + eventName, { requestId, result });
                    });
            }
        });

        app.on('quit', (event, exitCode) => {
            console.log(` Application is going to be Exit with code ${exitCode}`);
        });

        app.on('gpu-process-crashed', (event, killed) => {
            if (!killed) {
                console.log(` GPU Process Crashed is going to be close the Application`);
                app.quit();
            }
        });

        app.on('renderer-process-crashed', (event, { webcontent, killed }) => {
            if (!killed) {
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