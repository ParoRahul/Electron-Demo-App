/* 
* coding  : utf-8 
* Created on Thu Jul 23 06:02:45 2019
* author  : RAHUL
*/ 

'use strict';


if (rendererObj.is("page-main-index")){
    $("#app-stack").on("stackLoad.rendererObj",function(ev,result,layer,tab) {
        if (typeof result.data.project_list != "undefined") {
            //console.log(' Event Triggertrd');
            var appStack = $(this).tabstack();
            var projectList = layer.find(".project-list")
            rendererObj.on("ProjectCreated",function({project_id,name,plugin_name,time_created,plugin_icon}){
                projectList.append(
                `<li data-project="${project_id}">
                    <div><i class="{{plugin_icon}}"></i>
                         <i class="icofont-ui-delete icofont-md"></i>
                         <i class="icofont-gear icofont-md"></i>
                    </div>
                    <div class="type">${plugin_name}</div>
                    <div class="title">${name}</div>
                    <div class="time">${interpreter.__("project_list_time")}${time_created}</div>
                </li>`);
            });
            
            rendererObj.body.on("click",".project-list li", function (ev) {
            //projectList.on("click", " > li ", function (ev) {    
                console.log(' Event Triggertrd From project list');
                var currTarget = $(ev.currentTarget);
                ev.stopImmediatePropagation();
                if(currTarget.is(".item-add")){
                    rendererObj.body.trigger("menu.rendererObj",["new"])
                }else{
                    appStack.openProject(currTarget.data("project"));
                }
            });

            rendererObj.body.on("click",".project-list > li i.icofont-ui-delete", function (ev) {
            //projectList.on("click"," li i.icofont-ui-delete ", function (ev) {  
                console.log(' Event Triggertrd From project Close button');
                var projectContainer = $(ev.currentTarget).parents("li").first();
                var project_id = projectContainer.data("project");
                console.log(` project_id ${project_id}`);
                ev.stopImmediatePropagation();
                confirm(interpreter.__("project_list_delete"),() => {
                    rendererObj.post(rendererObj.url("Remove","project","project_id=" + project_id), function () {
                        db.projectDB.remove({ _id: project_id},{ multi: true }).
                        then(function (result) {
                            projectContainer.remove();
                            appStack.closeProject(project_id)
                        }).catch(function (err) {
                            console.log(err);
                        });
                    })
                })
            });

            /* rendererObj.body.on("click",".stack-tab", function (ev) {
                console.log(" Tab clicked ");
                var targetTab = $(ev.currentTarget);
                var tabIndex = $('.stack-tab').index(targetTab);
                var targetlayer = $('.stack-layer').eq(tabIndex);
                $('.stack-layer').removeClass("active");
                $('.stack-tab').removeClass("active");
                targetlayer.addClass("active");
                targetTab.addClass("active");
            });*/
        } 
    });

    rendererObj.body.on("click",".project-tab", function(ev) {
        let type = $(this).attr('data-identifier');
        $(".project-list >li").each(function(index){
            if ($(this).find('.type').html() != type) {
                $(this).hide() 
            }
            else(
                $(this).show()
            )
        })
        ev.stopImmediatePropagation();
    });
}

$(function () {

    $('#new-project').on('click',function (e) {
        console.log("Going To create new Project");
        rendererObj.openUrl(rendererObj.url("New","project"),"New-Project-Window",{
            width: 700,
            height: 520,
            frame: false,
            resizable: false
        });
    });
   
    $('#nav-window .btn-exit').on('click',function (e) {
        window.confirm(interpreter.__("project_content_unsaved"),()=>{
            rendererObj.close();
        });
        e.stopImmediatePropagation();
    });


});