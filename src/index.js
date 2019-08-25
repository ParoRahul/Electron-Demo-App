/**
 * coding: utf-8 
 * Created on Fri Aug 03 00:46:45 2019
 * author: Rahul
 * Description: Starting Point of the App
 * 
 */

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;

const path = require('path')
let mainProcess = require(path.join(__dirname, 'mainProcess.js'));

let MainProcess = new mainProcess();
MainProcess.run();

process.on('uncaughtException', (err) => {
    console.log('An exception in the main thread was not handled.');
    console.log('This is a serious issue that needs to be handled and/or debugged.');
    console.log(`Exception: ${err}`);
});