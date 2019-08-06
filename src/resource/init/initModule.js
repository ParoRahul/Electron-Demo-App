/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:15:00 2019
 * author: Rahul
 * Description: 
 * 
 */
'use strict';
const Mustache = require('mustache');
const electron = require('electron');
const fs = require('fs');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;
const config = require('../../config.js')

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
    //var db = new Db(config.db.dbname, new Server(config.db.hostIp,config.db.port));
    /* MongoClient.connect(`mongodb://${config.db.hostIp}:${config.db.port}`,config.serveroptions,
     function(err, client) {      
        if (err) {
          $(".message").html(interpreter.__("init_page_db_connect_fail"));
          console.error(err);  
          return;
        }
        $(".message").html(interpreter.__("init_page_db_connect_done"));
        console.log('connection Establish ');
        //console.log(client.topology.clientInfo);
        const db = client.db(config.db.dbname);
        // Create the indexed collection
        db.createCollection('appuser', {strict:true}, function(err, collection) {
            if(err){
                $(".message").html("Table appuser Alreay exist");
                $(".message").html(err);
                client.close();
            }
            collection.createIndex(
                { userid : -1 }, function(err, result) {
                if (err){
                    console.log(result);
                    $(".message").html(err);
                    client.close();
                }    
                $(".message").html(err);
            });
        })
        //client.close();
       })  */
       MongoClient.connect(`mongodb://${config.db.hostIp}:${config.db.port}`,
       config.serveroptions).then(function(db){
            $(".message").html(interpreter.__("init_page_db_connect_done"));
            console.log('connection Establish ');
            var dbase = db.db(config.db.dbname);
            dbase.createCollection('appuser', 
                            { strict:true,
                              autoIndexId:true,
                              required: [ "phone" ],
                              properties: {
                                phone: {
                                   bsonType: "string",
                                   description: "must be a string and is required"
                                }
                              }
            }).catch((err)=>{
                                console.log(err);
                                $(".message").html(err);});      
       }).catch((err)=>{
            $(".message").html(interpreter.__("init_page_db_connect_fail"));
            console.error(err);
       })
})
