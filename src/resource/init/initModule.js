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
    $(".message").html(interpreter.__("init_page_db_start"))
    var ModulePaths = [path.join(__dirname,"..","..","plugin")];
    var manifests={};
    let path_loaded = 0;
    var data = {"project_list":[]};
    const url = 'mongodb://localhost:2001/admin'
    $(".message").html(interpreter.__("init_page_db_connect"))
    const dbInfo=new database()
    console.log(`mongodb://${dbInfo.hostip}:${dbInfo.port}`);

    MongoClient.connect(`mongodb://${dbInfo.hostip}:${dbInfo.port}`,dbInfo.serveroptions)
    .then(function(db){
        $(".message").html(interpreter.__("init_page_db_connect_done"));
        console.log('connection Establish ');
        var dbase = db.db(dbInfo.dbname);
        dbase.getCollectionNames().then((colNames)=>{
            colNames.forEach((collname) => {
                console.log(`verifying collections name ${collname}`);
                $(".message").html(`verifying collections name ${collname}`);
            });
        }).catch((err)=>{
            $(".message").html(err);
            console.error(err);
            db.close();
        });
    }).catch((err)=>{
            $(".message").html(err);
            console.error(err);
    }).finally(()=>{
    });
})
