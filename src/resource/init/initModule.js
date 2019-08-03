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

$(function(){
    var ModulePaths = [path.join(__dirname,"..","..","plugin")];
    var manifests={};
    let path_loaded = 0;
    var data = {"project_list":[]};
    
    var initilizeAPP = function() { 
        db.projectDB.find().
        then( (result)=>{
            while ( result.length ) {
                    data.project_list.push(result.shift());
            }
            console.log(` Total ${data.project_list.length} Projects Loaded`);
            data.manifests = manifests ;
            rendererObj.post(rendererObj.url("Init","init"),data,function(){
                setTimeout(function(){
                    rendererObj.openUrl(rendererObj.url("Index","main"),"Main-Window",{
                    width: 1370,
                    height: 730,
                    minWidth: 800,
                    minHeight: 700,
                    modal: false,
                    frame: false,
                    parent: null,
                    resizable: true,
                    webPreferences: {
                        nodeIntegration: true,
                    },
                    useContentSize: true
                })
                rendererObj.close();
            },3000)
            });
        }).catch((err)=>{
           console.log(" Error While Project DB Load " + err);
        });       
        
    }    
    
    ModulePaths.forEach(function(modulePath){
        fs.readdir(modulePath, function (err, folders) {
            if(err) {
                console.log('Error while reading plugin folder');
                return false;
            }
            let file_loaded = 0;
            folders.forEach(folder =>{
                let manifest_file = path.join(modulePath , folder, "manifest.json");
                fs.readFile(manifest_file, "utf8", (err, data) => {
                    if (err) {
                        console.log('Error while reading plugin folder '+ manifest_file);
                        initilizeAPP();
                        return ;
                    }
                    let manifest = JSON.parse(data);
                    let locales = {};
                    if(manifest.default_locale){
                        var default_locale = manifest.default_locale;
                        let locale_file = path.join(modulePath,folder,"locales",default_locale,"strings.json");
                        if(fs.existsSync(locale_file)) {
                            locales = JSON.parse(fs.readFileSync(locale_file, 'utf8'));
                        }
                        else {
                            var default_locale  = electron.remote.app.getLocale();
                            let locale_file = path.join(modulePath,folder,"locales",default_locale,"strings.json");
                            let stringJSON = fs.readFileSync(locale_file, 'utf8');
                            locales = JSON.parse(stringJSON);
                        }
                        let locale = default_locale;
                        data = Mustache.render(data,{"locales":locales});
                        manifest = JSON.parse(data);
                        delete manifest.default_locale;
                        manifest.locale = locale;
                    }
                    else {
                        var default_locale  = electron.remote.app.getLocale();
                        let locale_file = path.join(modulePath,folder,"locales",default_locale,"strings.json");
                        let stringJSON = fs.readFileSync(locale_file, 'utf8');
                        locales = JSON.parse(stringJSON);
                        let locale = default_locale;
                        data = Mustache.render(data,{"locales":locales});
                        manifest = JSON.parse(data);
                        delete manifest.default_locale;
                        manifest.locale = locale;
                    }
                    manifest.root = path.join(modulePath,folder);
                    manifests[manifest.identifier] = manifest;
                    if(++file_loaded == folders.length){
                        if(++path_loaded == ModulePaths.length){
                            initilizeAPP();
                        }
                    }
                });
            });         
        })
    });
})