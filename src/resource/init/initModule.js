/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:15:00 2019
 * author: Rahul
 * Description: 
 * 
 */

const Mustache = require('mustache');
const electron = require('electron')
const fs = require('fs');
const path = require('path');
const db = require(path.join(__dirname,"..","..",'datafactory.js'));
const mongo = require('mongodb').MongoClient

$(function(){
    if ( !rendererObj.is("init-page")){
        return;
    }
    $(".message").html(interpreter.__("init_page_dbserver_start"))
    var ModulePaths = [path.join(__dirname,"..","..","plugin")];
    var manifests={};
    let path_loaded = 0;
    var data = {"project_list":[]};
    const url = 'mongodb://localhost:2001'
    $(".message").html(interpreter.__("init_page_dbserver_connect"))
    mongo.connect(url, (err, client) => {
        if (err) {
          $(".message").html(interpreter.__("init_page_db_connect_fail"))
          console.error(err)  
          return
        }
        $(".message").html(interpreter.__("init_page_db_connect_done"))
        console.log('connection Establish ')
      })
})