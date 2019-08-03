/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Basic Configuration File  
 * 
 */

const path = require('path')
module.exports = {
    'basePath'          : path.join(__dirname,".."),
    'DBPath'            : path.join(__dirname,"..","db","Project_collection.json"),
    'defaultController' : 'init',
    'defaultLanguage'   : 'en',
    'debug'             : true,
    'debugWindow'       : 'ALL'
}
