/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Basic Configuration File  
 * 
 */

const path = require('path');
const fs = require('fs');

class config {
    constructor() {
        if (typeof config.instance === 'object') {
            //console.log(" First Instance created")
            return config.instance;
        }
        //console.log(" Single Tone Activated")
        config.instance = this;
        this.debug = true;
        this.logpath = path.join(__dirname, "..", "db");
        this.menuConfigFile = path.join(__dirname, 'menuConfig.json');
        this.windowConfigFile = path.join(__dirname, 'windowConfig.json');
        this.menuConfig = null;
        this.windowConfig = [];
        this.initWindowtitle = "Main_Window";
        this.upperToolbar=  [  {icon:"account_circle", id:"manageUser"}];
        this.lowerToolbar=  [  {icon:"settings_applications", id:"settings"},
                               {icon:"lock_open", id:"appLock"}];
        this.loadMenuConfig();
        this.loadWindowConfig();
        this.dbCfg = {
            dbpath: path.join(__dirname, "..", "db"),
            dbname: 'grootdb'
        }
    }

    loadMenuConfig() {
        let menuConfig = fs.readFileSync(this.menuConfigFile,'utf8');
        this.menuConfig = JSON.parse(menuConfig);
        /* fs.readFile(this.menuConfigFile,function(err, data){
            if (err) throw err;
            this.menuConfig = JSON.parse(data);             
        }); */
    }

    loadWindowConfig() {
        let windowConfig = fs.readFileSync(this.windowConfigFile,'utf8');
        this.windowConfig = JSON.parse(windowConfig);        
        /* fs.readFile(this.windowConfigFile,function(err, data){
            if (err) throw err;
            this.windowConfig = JSON.parse(data);             
        }) */
    }

    getWindowCfgByTitle(title) {
        return this.windowConfig.find(wincfg => wincfg.title == title)
    }

}

const configs = new config();

module.exports = configs;