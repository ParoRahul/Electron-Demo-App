/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:43:00 2019
 * author: Rahul
 * Description: Parent Calss of all scheduler 
 * 
 */

const Mustache = require('mustache');
const path     = require('path');
const fs       = require('fs');

class baseScheduler{
    constructor(base_path){
        this.base_path = base_path;
    }

    __(str){
        return this._interpreter.__(str);
    }

    setActionName(action_name){
        this.action_name = action_name;
    }
    
    render(html_name, data = {}){
        this.output = "";
        this.html_path=path.join(this.base_path,html_name+".html");
        let html = fs.readFileSync(html_path, 'utf-8');
        if(!data.platform){
            data.platform = process.platform;
        }
        if(!data.locales){
            data.locales = this._interpreter.locales;
        }
        content = Mustache.render(html, data);
        this.output += content;
    }

}

module.exports = baseScheduler;