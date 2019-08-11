/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:15:00 2019
 * author: Rahul
 * Description: 
 * 
 */
'use strict';
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config.js')
const database = require('../../database.js')


$(function(){
    if ( !rendererObj.is("init-page")){
        return;
    }
    var initilizeAPP = function() {
        setTimeout(function(){
                rendererObj.openUrl(rendererObj.url("Load","main"),"Main-Window",{
                    width: 1460,
                    height: 800,
                    minWidth: 800,
                    minHeight: 700,
                    modal: false,
                    frame: false,
                    parent: null,
                    resizable: true,
                    useContentSize: true,
                    webPreferences: {
                        nodeIntegration: true,
                        webviewTag: true,
                    }  
                })
                rendererObj.close();
            },3000)
    }    

    $(".message").html(interpreter.__("init_page_db_start"))
    var ModulePaths = [path.join(__dirname,"..","..","plugin")];
    var manifests={};
    let path_loaded = 0;
    var data = {"project_list":[]};
    const url = 'mongodb://localhost:2001/admin'
    $(".message").html(interpreter.__("init_page_db_connect"))
    const dbInfo=new database()
    console.log(`mongodb://${dbInfo.hostip}:${dbInfo.port}`);

    MongoClient.connect(`mongodb://${dbInfo.hostip}:${dbInfo.port}/admin`,dbInfo.serveroptions)
    .then(function(db){
        $(".message").html(interpreter.__("init_page_db_connect_done"));
        console.log('connection Establish ');
        initilizeAPP();
        db.close();
    }).catch((err)=>{
            $(".message").html(err);
            console.error(err);
    }).finally(()=>{
    });
})
