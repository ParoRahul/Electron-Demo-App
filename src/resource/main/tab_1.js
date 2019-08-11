/* 
* coding  : utf-8 
* Created on Thr Jul 04 11:57:45 2019
* author  : 683898
*/ 

'use strict';
const _ = require('lodash');
const TabGroup = require("./nevigitor.js");
const url = require('url');
const fs = require('fs');
const Mustache = require('mustache');

var tabGroup = new TabGroup({
    ready: ( tabGroup ) => {
        let homeTab = tabGroup.addTab({
            title: "Home",
            icon:"icon icofont-home icofont-lg",
            //src:'./example.html',
            divattibute:{
                id:"Home",
            },
            visible: true,
            closable :false ,        
            ready : (homeTab) => {
                /* let webview = homeTab.webview;
                if (!!webview) {
                    console.log(' Tab going to Load Home Tab ');
                    webview.addEventListener('did-start-loading', () => {
                        console.log(' from event listerner ');
                        webview.openDevTools(); 
                        homeTab.activate(); 
                    })
                } */ 
                LoadTab(homeTab)
            } 
        });
        console.log(' Tab Group Is ready ');
    }
});

function LoadTab(tab){
    let html_path = "D:/nodejs/Groot/src/resource/main/example.html";
    let html = fs.readFileSync(html_path, 'utf-8');
    let locales = interpreter.locales;
    html = Mustache.render(html, locales);
    let webview = tab.webview;
    webview.innerHTML=html;
    tab.activate();
    /* if (!!webview) {
        webview.loadURL(htmloutput,{
                baseURLForDataURL:url.format({
                pathname: html_path,
                protocol: 'file:',
                slashes: true })
        }).then(()=>{
            tab.activate()
        }).catch((err)=>{
            console.log( ` didnot load Url ${err}`);
        })
    } */
}



$(function(){
    if ( rendererObj.is("page-main-index") ){
        let html_path = "D:/nodejs/Groot/src/resource/main/example.html";
        let html = fs.readFileSync(html_path, 'utf-8');
        let locales = interpreter.locales;
        html = Mustache.render(html, locales);
        newTab=tabGroup.addTab({
                title: "Homejjj",
                icon:"icon icofont-home icofont-lg",
                divattibute:{
                    id:"Home",
                },
                innerhtml:html,
                visible: true,
                closable :true,
            });
    }
})