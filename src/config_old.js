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
            console.log(" Single Tone Activated")
            return config.instance;
        }
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

let config = {
    debug: true,
    logpath: path.join(__dirname, "..", "db"),
    dbCfg: {
        dbpath: path.join(__dirname, "..", "db"),
        dbname: 'grootdb'
    },
    windowCfgs: [{
            id: 0,
            title: 'Init Window',
            width: 600,
            height: 350,
            frame: false,
            parent: null,
            resizable: false,
            show: false,
            useContentSize: true,
            skipTaskbar: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
            },
            PageDtls: {
                homeDir: path.join(__dirname, 'init'),
                task: 'Load',
                page: 'index.html'
            }
        },
        {
            id: 1,
            title: 'Main Window',
            width: 1460,
            height: 800,
            minWidth: 800,
            minHeight: 700,
            skipTaskbar: false,
            frame: false,
            parent: null,
            resizable: true,
            useContentSize: true,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
            },
            PageDtls: {
                homeDir: path.join(__dirname, 'main'),
                task: 'Load',
                page: 'index.html'
            }
        },
        {
            id: 2,
            title: 'Confirm-Window',
            width: 400,
            height: 200,
            alwaysOnTop: true,
            show: false,
            modal: true,
            frame: false,
            resizable: false,
            closable: true,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
            },
            PageDtls: {
                homeDir: path.join(__dirname, 'main'),
                task: 'Load',
                page: 'index.html'
            }
        }
    ],

    getWindowCfgById: function(id) {
        return this.windowCfgs.find(wincfg => wincfg.id == id)
    },

    getWindowCfgByTitle: function(title) {
        return this.windowCfgs.find(wincfg => wincfg.title == title)
    },

    getWindowTitleById: function(id) {
        return this.windowCfgs.find(wincfg => wincfg.id == id).title
    },

    menuConfigFile: path.join(__dirname, 'menuConfig.json'),

    menuConfig: {},

    getMenuList: function() {
        if (menuConfig == null)
            fs.readFile(menuConfigFile).then((menuConfig) => {
                menuConfig = JON.parse(menuConfig);
                return menuConfig;
            }).catch((error) => {
                console.error(error);
                throw new Error('MenuConfig Not Found');
            });
        else {
            return menuConfig;
        }
    }

}

module.exports = config;