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
            console.log(" First Instance created")
            return config.instance;
        }
        console.log(" Single Tone Activated")
        config.instance = this;
        this.debug = true;
        this.logpath = path.join(__dirname, "..", "db");
        this.menuConfigFile = path.join(__dirname, 'menuConfig.json');
        this.windowConfigFile = path.join(__dirname, 'windowConfig.json');
        this.menuConfig = null;
        this.windowConfig = [];
        this.loadMenuConfig();
        this.loadWindowConfig();
        this.dbCfg = {
            dbpath: path.join(__dirname, "..", "db"),
            dbname: 'grootdb'
        }
    }

    getWindowCfgById(id) {
        return this.windowConfig.find(wincfg => wincfg.id == id)
    }

    getWindowCfgByTitle(title) {
        return this.windowConfig.find(wincfg => wincfg.title == title)
    }

    getWindowTitleById(id) {
        return this.windowConfig.find(wincfg => wincfg.id == id).title
    }

    loadMenuConfig() {
        fs.readFile(menuConfigFile).then((menuConfig) => {
            this.menuConfig = JON.parse(menuConfig);
        }).catch((error) => {
            console.error(error);
            throw new Error('MenuConfig Not Found');
        });
    }

    loadWindowConfig() {
        fs.readFile(windowConfigFile).then((windowConfig) => {
            this.menuConfig = JON.parse(windowConfig);
        }).catch((error) => {
            console.error(error);
            throw new Error('MenuConfig Not Found');
        });
    }

}

const configs = new config();

module.exports = configs;