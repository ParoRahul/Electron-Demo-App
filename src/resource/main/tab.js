/* 
* coding  : utf-8 
* Created on Thr Jul 04 11:57:45 2019
* author  : 683898
*/ 

'use strict';
const _ = require('lodash');

(function($){

    let tabHtml = `<li class="stack-tab" >
        <i class="icon icofont-home icofont-lg"></i>
        <label><span class="tab-title"></span></label>
        <i class="ico-remove icofont-close icofont-lg"></i>
        </li>`;
    let layerHtml =`<div class="stack-layer"></div>`;

    var AppStack = function () {
        this.element = $("#app-stack");
        this.tabList = $("#tab-list");
        this.layerList = $("#layer-list");
        this.iconRight = this.tabList.find(".ico-more-right");
        this.bindEvents();
        this.caches = {};
        this.reload();
    };

    AppStack.prototype.showStack = function(layerTo){
        var targetTab = null;
        var targetLayer = null;
        var sourceTab = this.tabList.filter('.active');
        var sourceLayer = this.layerList.filter('.active');
        if(typeof layerTo === "number") {
            targetTab = this.tabList.eq(layerTo);
            targetLayer = this.layerList.eq(layerTo);
        } else if(typeof layerTo === "string") {
            targetTab = this.tabList.filter("[data-target='"+layerTo+"']");
            targetLayer = this.layerList.filter("#"+layerTo);
        } else{
            targetLayer = layerTo;
            var layerIndex = this.layerList.index(layerTo);
            targetTab = this.tabList.eq(layerIndex);
        }
        if(targetTab != null && !targetTab.hasClass("active")){
            this.tabList.removeClass("active");
            this.layerList.removeClass("active");
            targetTab.addClass("active");
            targetLayer.addClass("active");
            var elementId = this.element.attr("id");
            if(!_.isEmpty(elementId) && this.element.parents("[data-toggle='stack']").length == 0){
                var targetIndex = this.tabList.index(targetTab) + 1;
                window.location.hash = elementId+"-"+targetIndex;
            }
            //this.element.trigger('change', [targetTab,targetLayer,this.element]);
            targetLayer.find(".stack-layer .active").each(function(){
                var childStack = $(this).data("stack");
                if( childStack ) {
                    childStack.loadAjax($(this));
                }
            });
        }
        this.loadAjax(targetLayer);
    };

    AppStack.prototype.loadAjax = function(layer) {
        if (!layer || typeof (layer.attr("stack-src")) !== "string") {
            console.log(" From First Return");
            return;
        }
        var isLayerActive = layer.is(".active");
        /* layer.parents(".stack-layer").each(function(){
            if(!$(this).is(".active")){
                isLayerActive = false;
            }
        }); */
        if(!isLayerActive){
            return;
        }
        var layerIndex = this.layerList.index(layer);
        var tab = this.tabList.eq(layerIndex);
        var element = this.element;
        var $this = this;
        element.trigger('beforeSend', [layer, element]);
        var src = layer.attr("stack-src");
        layer.addClass("ajax-loading");
        tab.addClass("ajax-loading");
        var params = {};
        if (layer.data("stack-params")) {
            params = layer.data("stack-params");
        }
        rendererObj.post(src, params, function (result) {
            try {
                var details = JSON.parse(result);
                if (details && details.result === 1) {
                    element.trigger('ajaxSuccess', [details, layer, element]);
                    if(details.data.html){
                        if(layer.find('.layer-content').length){
                            layer.find('.layer-content').html(details.data.html);
                        }else{
                            layer.html(details.data.html);
                        }
                        //rendererObj.toggleData(layer);
                    }
                    if(details.data.title){
                        tab.find('.tab-title').html(details.data.title)
                    }
                    element.trigger('stackLoad.rendererObj', [details, layer, tab]);
                } else {
                    element.trigger('ajaxFail', [details, layer, element]);
                }
            } catch (err) {
                element.trigger('ajaxError', [result, layer, element]);
            } finally {
                layer.removeClass("ajax-loading");
                tab.removeClass("ajax-loading");
                layer.removeAttr("stack-src").attr("data-stack-src", src);
            }
        }).done(function () {
            element.trigger('ajaxComplete', [layer, element]);
            layer.removeClass("ajax-loading");
            tab.removeClass("ajax-loading");
            layer.removeAttr("stack-src").attr("data-stack-src", src);
        });
    }

    AppStack.prototype.addStack = function(tab,layer){
        this.tabList.push(tab[0]);
        this.layerList.push(layer[0]);
        this.bindEvent2Tab(tab,layer);
        layer.data("stack",this);
        //console.log(`layer ${typeof(layer)}`)
        this.showStack(layer);
    };

    AppStack.prototype.removeStack = function(tabIndex){
        if(typeof tabIndex !== "number"){
            tabIndex = this.layerList.index(tabIndex);
        }
        var removeTab = this.tabList.eq(tabIndex);
        var removeLayer = this.layerList.eq(tabIndex);
        if(removeTab.hasClass("active")){
            var prevIndex = tabIndex - 1;
            if(prevIndex == -1){
                prevIndex = this.tabList.length - 1;
            }
            this.showStack(prevIndex);
        }
        this.tabList.splice(tabIndex, 1);
        this.layerList.splice(tabIndex, 1);
        removeTab.remove();
        removeLayer.remove();
    };

    AppStack.prototype.bindEvents = function() {
        rendererObj.on('ProjectCreated', ({project_id}) => {
            this.openProject(project_id);
        });
    };

    AppStack.prototype.bindEvent2Tab = function(tab, layer){
        var that = this;
        tab.on('click ifChecked', function (event) {
            if(!tab.is(".active") && event.button == 0){
                if(!_.isEmpty($(this).data("target"))){
                    console.log('data is  null ');
                    that.showStack($(this).data("target"));
                }else{
                    console.log('data is not null ');
                    that.showStack(layer);
                }
                event.stopPropagation();
            }
        });
    };

    AppStack.prototype.reload = function(){
        var targetIndex = 0;
        var hash = window.location.hash;
        var elementId = this.element.attr("id");
        if(!_.isEmpty(hash) && hash.indexOf(elementId) >= 0 && hash.length > elementId.length + 2){
            var index = hash.substr(elementId.length + 2);
            if(!isNaN(index) && _.parseInt(index)<=this.layers.length){
                targetIndex = _.parseInt(index);
            }
        } 
        var targetTab   = null;
        var targetLayer = null;
        if(targetIndex>0){
            targetLayer = this.layerList.eq(targetIndex-1);
            targetTab = this.tabList.eq(targetIndex-1);
            this.layerList.removeClass("active");
            this.tabList.removeClass("active");
            targetLayer.addClass("active");
            targetTab.addClass("active");
        }else{
            targetLayer = this.layerList.filter(".active");
            if(targetLayer.length == 0){
                targetLayer = this.layerList.eq(0);
                targetTab = this.tabList.eq(0);
                targetLayer.addClass("active");
                targetTab.addClass("active");
            }
        }
        var src = targetLayer.attr("data-stack-src");
        if(!_.isEmpty(src)){
            targetLayer.removeAttr("data-stack-src").attr("stack-src", src);
        }
        this.loadAjax(targetLayer);
    }

    AppStack.prototype.createStack = function(project_id){
        var tab = $(tabHtml).appendTo(this.tabList);
        var layer = $(layerHtml).appendTo(this.layerList);
        tab.find(".ico-remove").on("click",(ev)=>{
            if(tab.is('.changed')){
                window.confirm(i18n.__("project_content_unsaved"),()=>{
                    layer.find("iframe")[0].contentWindow.plugin.setChanged(false);
                    tab.find(".ico-remove").trigger('click');
                });
            }else{
                var currTab = $(ev.target).parents(".stack-tab").first();
                if(currTab.data("cache-index")){
                    delete this.caches[currTab.data("cache-index")]
                }
                var currIndex = this.tabList.children(".stack-tab").index(currTab);
                this.removeStack(currIndex);
            }
        })
        tab.on("mousedown",(ev)=>{
            if(ev.button == 1){
                var currTab = $(ev.target).parents(".stack-tab").first();
                var currIndex = $tabList.children(".stack-tab").index(currTab);
                if(currIndex > 0){
                    if(currTab.data("cache-index")){
                        delete this.caches[currTab.data("cache-index")]
                    }
                    this.removeStack(currIndex);
                }
            }
        });
        return {"tab":tab,"layer":layer};
    }

    AppStack.prototype.openProject = function(project_id){
        if(this.caches["project_"+project_id]){
            this.showStack(this.caches["project_"+project_id])
        }else{
            console.log(" From OPEN PROJECT");
            var {tab,layer} = this.createStack(project_id);
            tab.attr("project-id",project_id);
            layer.attr("project-id",project_id);
            layer.addClass("layer-project");
            layer.attr('stack-src',rendererObj.url("Dashboard","project","project_id="+project_id));
            tab.data("cache-index","project_"+project_id);
            this.caches["project_"+project_id] = layer;
            this.addStack(tab, layer)
        }
    }

    AppStack.prototype.openProjectList = function(project_list){
        if(this.caches["list"]){
            this.showStack(this.caches["list"])
        } 
        else {
            var {tab,layer} = this.createStack();
            layer.addClass("layer-project-list");
            layer.attr('stack-src',rendererObj.url('List','project'));
            layer.data("stack-params",project_list);
            tab.data("cache-index","list");
            this.caches["list"] = layer;
            this.addStack(tab,layer);
            //console.log('project-List is  created ');
        }
    }

    AppStack.prototype.closeProject = function(project_id){
        if(this.caches["project_"+project_id]){
            this.removeStack(this.caches["project_"+project_id])
            delete this.caches["project_"+project_id];

        }
    }

    $.fn.tabstack = function(){
        if(!this.is("#app-stack")){
            return;
        }
        var appStack = this.data("appStack");
        if(!appStack){
            appStack = new AppStack();
            this.data("appStack",appStack)
        }
        return appStack;
    }
})(jQuery);

$(function(){
    var appStack = $("#app-stack").tabstack();
    if ( rendererObj.is("page-main-index") ){
         appStack.openProjectList();         
    }
})