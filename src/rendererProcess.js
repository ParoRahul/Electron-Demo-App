/**
 * coding: utf-8 
 * Created on Fri Oct 26 18:58:45 2018
 * author: 683898
 * Description: Common Rendrer Process for All window 
 */
'use strict';
const { ipcRenderer, remote, shell } = require('electron');
let currentWin = remote.getCurrentWindow();

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const dialog = remote.dialog;
const nativeImage = remote.nativeImage;

var IPCResponse = function() {};
IPCResponse.prototype.done = function(callback) {
    this.done_callback = callback;
}

rendererObj = {

    time: new Date().getTime(),

    _init: function() {
        this.baseUrl = window.location.href;
        this.title = document.title;
        this.id=currentWin.id;
    },

    is: function(pageId) {
        return $(document.body).attr("id") === pageId;
    },

    close: function(id) {
        if (id)
            ipcRenderer.send("window.close", id)
        else
            //ipcRenderer.send("window.close", this.id)
            currentWin.close()
    },

    open: function(windowTitle) {
        ipcRenderer.send("window.open", {windowTitle})
    },

    post(url, data, callback) {
        if (typeof data == "function") {
            callback = data;
            data = {};
        }
        return this.request(url, data, callback, "post");
    },

    request(url, data, callback, type) {
        var rnd = new Date().getTime() + "." + this.time;
        ipcRenderer.send("$.ajax", { "url": url, "data": data, type: type, "requestId": rnd });
        var localResponse = new IPCResponse();
        ipcRenderer.once("$.ajax.response." + rnd, function(event, response) {
            var content = response.content;
            if (typeof callback === "function") {
                callback(content);
            }
            if (typeof localResponse.done_callback === "function") {
                localResponse.done_callback();
            }
        });
        return localResponse;
    },

    exist: function(id) {
        return ipcRenderer.sendSync("window.exist", id);
    },

    send: function(eventName, args, windowName) {
        ipcRenderer.send("window.triggerEvent", { eventName: eventName, targetWindow: windowName, args: args })
    },

    hide: function(id) {
        if (id )
            ipcRenderer.send("window.hide", id)
        else
            //ipcRenderer.send("window.close", this.id)
            currentWin.hide()
    },

    show: function(features) {
        if (id )
            ipcRenderer.send("window.show", id)
        else
            currentWin.show()
    },

    dialogshow_depricated: function(windowTitle, features, requestId, eventName) {
        if (typeof name === "undefined") {
            windowTitle = window.name;
        }
        ipcRenderer.send("dialog.Show", { windowTitle, features, requestId, eventName });
    },

    dialogOpen:function (features){
        return new Promise (function(resolve, reject){
            dialog.showOpenDialog(features).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    },

    dialogSave:function (features){
        return new Promise (function(resolve, reject){
            dialog.showSaveDialog(features).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    },

    once: function(eventName, callback) {
        if (typeof callback == "function") {
            ipcRenderer.once("window.addEventListener." + eventName, (event, args) => {
                callback(args)
            });
        }
    },
    
    openExternal: function(url) {
        return shell.openExternal(url);
    }
};

rendererObj.ipcRenderer = ipcRenderer;

$(function() {
    rendererObj._init();

    /* $(".btn").on("click", function(event) {
        if ($(this).attr("disabled")) {
            event.stopImmediatePropagation();
            return false;
        }
    });
    */
    $('.btn-minimize').on('click', () => {
        currentWin.minimize();
    });

    $('.btn-resize').on("click", function() {
        if (currentWin.isMaximized()) {
            currentWin.unmaximize();
            this.innerHTML='crop_din';
        } else {
            currentWin.maximize()
            this.innerHTML='filter_none';
        }
    });

    $('.btn-exit').on('click', (ev) => {
        let id = currentWin.id;
        rendererObj.close(id);
    });

    /*     if (!rendererObj.exist("Confirm-Window")) {
            rendererObj.openUrl(rendererObj.url("Confirm", "main"), 'Confirm-Window', {
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
                }
            });
        }

        window.confirm = function(text, callback) {
            let requestId = "ConfirmRequest_" + rendererObj.time + new Date().getTime();
            rendererObj.once("window.confirm.return", function(result) {
                if (requestId == result.requestId) {
                    if (typeof callback == 'function') {
                        callback(result.data);
                    }
                }
            });
            rendererObj.send("window.confirm", { text: text, parent: window.name, requestId: requestId }, 'Confirm-Window');
        }
     */
})