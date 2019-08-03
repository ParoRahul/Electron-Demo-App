/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Parent Calss of all scheduler 
 * 
 */

//const {session} = require('electron');
const Mustache = require('mustache');
const path     = require('path');
const fs       = require('fs');
const url      = require('url');

class Scheduler{
    constructor(scheduler_name){
        this.base_path = path.join(__dirname,"..",'resource');
        this.scheduler_name = scheduler_name.toLowerCase();
        this.redirect_url = false;
    }

    __(str){
        return this._interpreter.__(str);
    }

    setActionName(action_name){
        this.action_name = action_name;
    }
    
    renderPartial(html_name, data = {}){
        let html_path = path.join(this.base_path,this.scheduler_name,html_name+".html");
        let html = fs.readFileSync(html_path, 'utf-8');
        if(!data.platform){
            data.platform = process.platform;
        }
        if(!data.locales){
            data.locales = this._interpreter.locales;
        }
        html = Mustache.render(html, data);
        return html;
    }

    render(html_name, data = {}){
        this.html_path = path.join(this.base_path,this.scheduler_name,html_name+".html");
        let html = this.renderPartial(html_name, data);
        this.echo(html);
    }

    echo(content){
        if(typeof this.output != "string"){
            this.output = "";
        }
        this.output += content;
    }

    redirect(action,controller=null,query=""){
        this.redirect_url = this.url(action,controller,query);
    }

    url(action,controller,query){
        if(action && action.indexOf("&") === 0){
            query = action;
            action = null;
        }
        if(controller && controller.indexOf("&") === 0){
            query = controller;
            controller = null;
        }
        if(typeof(controller) === "undefined" || controller === null){
            controller = this.controller_name;
        }
        if(typeof(action) === "undefined" || action === null){
            action = this.action_name;
        }
        if(typeof query === "undefined" || query === null){
            query = "";
        }
        if(query.indexOf("&") === 0){
            query = query.substr(1);
        }
        let args = {
            pathname: path.join(this.base_path, "html" , controller , action),
            protocol: 'file:',
            slashes: true
        }
        if(query != ""){
            args.search = "?"+query;
        }
        return url.format(args);
    }

    success(reason = "Successful operation", data = "", selector="") {
        this.result(reason, data, 1, selector);
    }

    fail(reason = "error", selector="", code = 500, second=5) {
        this.result(reason, "", code, selector);
    }

    result(reason, data, code, selector) {
        let result_obj = {"result" : code};
        if(data != ""){
            result_obj["data"] = data;
        }
        if(reason != ""){
            result_obj["reason"] = reason;
        }
        if(selector != ""){
            result_obj["selector"] = selector;
        }
        this.echo(JSON.stringify(result_obj));
    }
}

module.exports = Scheduler;