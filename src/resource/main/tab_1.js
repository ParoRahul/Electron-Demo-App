/* 
* coding  : utf-8 
* Created on Thr Jul 04 11:57:45 2019
* author  : 683898
*/ 

'use strict';
const _ = require('lodash');
const TabGroup = require("electron-tabs");

function AppTabs() {
    if (typeof AppTabs.instance === 'object') {
		return AppTabs.instance;
	}  
    this.tabGroup = new TabGroup();
    let hometab = this.tabGroup.addTab({
            title: "Home",
            src: "http://electron.atom.io",
            icon:"icon icofont-home icofont-lg",
            visible: true,
            closable :false,
            active : true
    });
    AppTabs.instance = this;
    return this;
}

$(function(){
    if ( rendererObj.is("page-main-index") ){
        let appTabs = new AppTabs();         
    }
})