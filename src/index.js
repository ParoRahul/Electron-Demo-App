/**
 * coding: utf-8 
 * Created on Fri Aug 03 00:46:45 2019
 * author: Rahul
 * Description: Starting Point of the App
 * 
 */

const path = require('path')
const configPath = path.join(__dirname,'config.js');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
let mainProcess = require(path.join(__dirname,"mainProcess"));

let window_option  = {
    width: 600,
    height: 350,
    frame: false,
    parent: null,
    resizable: false,
    show:false,
    useContentSize: true,
    skipTaskbar:true,
    webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker:true,
    }   
}

mainProcess.createDesktopApplication(configPath);
mainProcess.app().run(window_option);

