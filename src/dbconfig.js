/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Basic DB Configuration File  
 * 
 */

const path = require('path')
const db = {
    'dbpath'            : path.join(__dirname,"..","db"),
    'hostIp'            : 'localhost',
    'port'              :  2001,
    'dbname'            : 'grootdb',
    'userid'            : 'grootuser',
    'password'          : 'grootpassword',
}

const serveroptions={
    useNewUrlParser: true ,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
}

const collections=['appUser','itemMaster','comapanyMaster']

module.exports = {
    'db'                : db,
    'serveroptions'     : serveroptions,
    'collections'       : collections
}
