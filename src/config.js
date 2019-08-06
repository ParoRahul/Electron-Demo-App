/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Basic Configuration File  
 * 
 */

const path = require('path')
const db = {
    'dbpath'            : path.join(__dirname,"..","db"),
    'hostIp'            : 'localhost',
    'port'              : 2001,
    'dbname'            : 'grootdb',
    'userid'            : 'grootuser',
    'password'          : 'grootpassword',
}

const serveroptions={
    useNewUrlParser: true ,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
}

module.exports = {
    'basePath'          : path.join(__dirname,".."),    
    'defaultController' : 'init',
    'defaultLanguage'   : 'en',
    'debug'             : true,
    'debugWindow'       : 'ALL',
    'db'                : db,
    'serveroptions'     : serveroptions
}
