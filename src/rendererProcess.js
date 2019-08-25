/**
 * coding: utf-8 
 * Created on Fri Oct 26 18:58:45 2018
 * author: 683898
 * Description: Rendrer Process for All window 
 */

const {ipcRenderer,remote,shell} = require('electron');
let currentWin = remote.getCurrentWindow();

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const nativeImage = remote.nativeImage;

var IPCResponse = function(){};
IPCResponse.prototype.done = function(callback){
    this.done_callback = callback;
}

rendererObj = {

    time:new Date().getTime(),

    body:$(document.body),

    _init:function(){
        this.baseUrl = window.location.href;
        /* var matches =/[\/\\]([^\/\\]+)[\/\\]([^\/\\?]+)(\?[^\/\\]+)?$/.exec(window.location);
        if(matches){
            this.controller = matches[1];
            this.action = matches[2];
        }
        console.log(`base URL ${this.baseUrl} controller ${this.controller}  window ${window.location.href} `); */
    },

    is:function(pageId){
        return this.body.attr("id") === pageId;
    },

    url:function (action,controller,query) {
        if(action && action.indexOf("&") === 0){
            query = action;
            action = null;
        }
        if(controller && controller.indexOf("&") === 0){
            query = controller;
            controller = null;
        }
        if(typeof(controller) === "undefined" || controller === null){
            controller = this.controller;
        }
        if(typeof(action) === "undefined" || action === null){
            action = this.action;
        }
        if(typeof query === "undefined" || query === null){
            query = "";
        }
        if(query.indexOf("&") === 0){
            query = query.substr(1);
        }
        var formatUrl = this.baseUrl + "/" + controller + "/" + action;
        if(query != ""){
            formatUrl += "?"+ query;
        }
        //console.log(formatUrl);
        return formatUrl;
    },

    openUrl:function(url,name,features){
        ipcRenderer.send("window.open",{"url":url,"name":name,"features":features,"parent":window.name})
        return {
            close:function(){
               rendererObj.close(name);
            }
        }
    },

    close:function(name){
        if(typeof name === "undefined"){
            name = window.name;
        }
        ipcRenderer.send("window.close",name)
    },

    post(url, data, callback){
        if(typeof data == "function"){
            callback = data;
            data= {};
        }
        return this.request(url, data, callback, "post");
    },

    request(url, data, callback, type){
        var rnd = new Date().getTime() + "." + this.time;
        //console.log(` URL ${url} `);
        ipcRenderer.send("$.ajax",{"url":url,"data": data, type:type,"requestId":rnd});
        var localResponse = new IPCResponse();
        ipcRenderer.once("$.ajax.response."+rnd, function (event, response) {
            var content = response.content;
            if(typeof callback === "function"){
               //console.log('inside renderer catch '+ response.content);
               callback(content);
            }
            if(typeof localResponse.done_callback === "function"){
               localResponse.done_callback();
            }
        });
        return localResponse;
    },

    exist:function(name){
        if(typeof name === "undefined"){
            name = window.name;
        }
        return ipcRenderer.sendSync("window.exist",name);
    },

    send:function(eventName, args, windowName){
        ipcRenderer.send("window.triggerEvent",{eventName:eventName,targetWindow:windowName,args:args})
    },

    hide:function(name){
        if(typeof name === "undefined"){
            name = window.name;
        }
        ipcRenderer.send("window.hide",name)
    },

    show:function(name,features){
        if(typeof name === "undefined"){
            name = window.name;
        }
        ipcRenderer.send("window.show",{name:name,features:features})
    },

    dialogshow:function(name,features,requestId,eventName){
        if(typeof name === "undefined"){
            name = window.name;
        }
        ipcRenderer.send("dialog.Show",{name,features,requestId,eventName});
    },

    once:function(eventName,callback){
        if(typeof callback == "function"){
            ipcRenderer.once("window.addEventListener."+eventName,  (event, args) =>{
                callback(args)
            });
        }
    },

    on:function(eventName, callback){
        if(typeof callback == "function"){
            ipcRenderer.on("window.addEventListener."+eventName,  (event, args) =>{
                callback(args)
            });
        }
    },

    openExternal:function(url){
        return shell.openExternal(url);
    },

    toggleData:function(parent){
        if(typeof parent === "undefined"){
            parent = this.body;
        }else{
            parent.find("[data-toggle='dropdown']").dropdown();
        }
        parent.find("[data-toggle='stack']").stack();
        parent.find("[data-toggle='icheck']").iCheck();
    }
};

rendererObj.ipcRenderer = ipcRenderer;

$(function(){
    rendererObj._init();
     
    $(".btn").on("click", function (event) {
        if($(this).attr("disabled")) {
            event.stopImmediatePropagation();
            return false;
        }
    });

    $('#nav-window').on('click','.btn-minimize', () => {
        currentWin.minimize();
    }).on("click",".btn-resize",function(){
        var $this = $(this);
        $this.find('i').toggleClass('icofont-maximize').toggleClass('icofont-resize')
        if($this.find('i').is('.icofont-maximize')){
            currentWin.unmaximize()
        }else{
            currentWin.maximize()
        }
    }).on('click','.btn-exit', (ev) => {  
        console.log('Return Log');      
        rendererObj.close();
    });
    
    if(!rendererObj.exist("Confirm-Window")){
        rendererObj.openUrl(rendererObj.url("Confirm","main"),'Confirm-Window',{
            width: 400,
            height: 200,
            alwaysOnTop:true,
            show:false,
            modal: true,
            frame: false,
            resizable : false,
            closable : true,
            useContentSize: true,
            webPreferences: {
                nodeIntegration: true,
                nodeIntegrationInWorker:true,
            }
        });
    }
    
    window.confirm=function(text,callback){
        let requestId = "ConfirmRequest_"+rendererObj.time + new Date().getTime();
        rendererObj.once("window.confirm.return",function(result){
            if(requestId == result.requestId){
                if(typeof callback == 'function'){
                    callback(result.data);
                }
            }
        });
        rendererObj.send("window.confirm",{text:text,parent:window.name,requestId:requestId},'Confirm-Window');
    }

})