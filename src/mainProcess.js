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
        // Note that the path to electron may vary according to the main file
        electron: require(`${__dirname}/node_modules/electron`)
    });
     */
const path = require('path');
const url = require('url');
let interpreter;
let configs;

class mainProcess {
    constructor() {
        app.requestSingleInstanceLock();
        if (!app.hasSingleInstanceLock()) {
            console.log(" ............................................");
            console.log(" A Instance of The Application is running ...");
            console.log(" ............................................");
            app.quit();
        }
        configs = require(path.join(__dirname, 'config.js'));
        app.setAppLogsPath(configs.logpath);
        interpreter = new(require(path.join(__dirname, 'locale', 'interpreter.js')));
    }

    createWindow(id) {
        let window = new BrowserWindow(configs.getWindowCfgById(id));

        window.loadURL(url.format({
            protocol: 'file',
            slashes: true,
            pathname: path.join(__dirname, 'main', 'index.html')
        })).then(() => {
            //this.pageScheduler(id).then(() => {
            if (configs.debug) {
                window.openDevTools();
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

            return window;
        }).catch(err => console.error(err));
    }

    pageScheduler(id, data = {}) {
        return new Promise(function(resolve, reject) {
            let option = configs.getWindowCfgById(id);
            let schedulerCls = require(path.join(option.PageDtls.homeDir, "scheduler.js"));
            let scheduler = new schedulerCls(option.PageDtls.homeDir);
            scheduler._interpreter = interpreter;
            let action_func_name = "action" + option.PageDtls.task;
            scheduler.setActionName(option.PageDtls.task);
            scheduler.action_result = scheduler[action_func_name](data);
            let html = 'data:text/html;charset=UTF-8,' +
                encodeURIComponent("<script>window.name='" + option.title + "';</script>\n" + scheduler.output);
            let window = BrowserWindow.fromId(id);
            window.loadURL(html, {
                baseURLForDataURL: url.format({
                    pathname: scheduler.base_path,
                    protocol: 'file:',
                    slashes: true
                })
            }).then(() => {
                resolve();
            }).catch(() => {
                reject();
            })
        });
    }


    run() {
        /*  if (configs.debug) {
             app.disableHardwareAcceleration();
         } */
        app.disableHardwareAcceleration();
        app.on('ready', () => {
            if (BrowserWindow.fromId(1) == null) {
                this.createWindow(1);
            }
        });

        ipcMain.on('window.open', (event, { id, parent_id }) => {
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow == null) {
                this.createWindow(id);
            } else {
                currentWindow.show();
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
            let currentWindow = BrowserWindow.fromId(id);
            if (currentWindow != null) {
                currentWindow.webContents.send("window.addEventListener." + eventName, args);
            }
        });

        ipcMain.on('dialog.Show', (event, { id, requestId, eventName }) => {
            let currentWindow = BrowserWindow.fromId(id);
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