/**
 * coding: utf-8 
 * Created on Fri Aug 03 01:15:00 2019
 * author: Rahul
 * Description: Init Html Loader Process
 * 
 */

const path = require('path');
const baseScheduler = require(path.join(__dirname,"..","common","scheduler.js"));
//const PluginManager = require(path.join(__dirname,"pluginManager.js")); 
//const ProjectCache = require(path.join(__dirname,"ProjectCache.js"));

class initScheduler extends baseScheduler{
    actionLoad(){
        let packJson = require(path.join(__dirname,"..","..","..","package.json"));
        let version = packJson.version;
        this.render("index",{app_version:version});
    }

    actionInit({manifests,project_list}){
        let pluginManager = PluginManager.defaultManager();
        for(let i in PluginManager.predefinedPlugins){
            let id = PluginManager.predefinedPlugins[i];
            pluginManager.addManifest(manifests[id]);
        }
        let ids = Object.keys(manifests).sort();
        for(let i in ids){
            let id = ids[i];
            if(PluginManager.predefinedPlugins.indexOf(id) == -1){
                pluginManager.addManifest(manifests[id]);
            }
        }
        let projectCache = ProjectCache.defaultCache();
        for(let i=0;i<project_list.length;i++){
            var project = projectCache.addProjectJson(project_list[i]);
            var plugin = pluginManager.getPlugin(project.getPlugin());
            if(plugin){
                project.setPluginName(plugin.getName());
                project.setPluginIcon(plugin.getIcon());
            }
        }
        this.success();
    }
}
module.exports = initScheduler;