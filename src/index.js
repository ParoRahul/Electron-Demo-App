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
let mainProcess = require(path.join(__dirname,'mainProcess.js'));


Let MainProcess = new mainProcess();
MainProcess.app();

