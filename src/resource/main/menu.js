// created by Rahul at 2019/06/06 18:23.
// 
// this is on line 1.
// this is on line 2.
// this is on line 3.

rendererObj.Menu = function(){}
rendererObj.Menu.template = [
    {
        label:interpreter.__("menu_file"),
        role:"file",
        submenu:[
            {
                label:interpreter.__("menu_file_new"),
                iconfont:"icofont-plus-square  icofont-md",
                role:"new"
            },
            {
                type:"separator"
            },
            {
                label:interpreter.__("project_import_text"),
                role:"importList",
                iconfont:"icofont-sign-in  icofont-md",
                submenu:[
                    {
                        label:interpreter.__("menu_file_import"),    
                        role:"import_file"
                    },
                    {
                        label:interpreter.__("menu_folder_import"),    
                        role:"import_folder"
                    }
                ]
            },
            {
                label:interpreter.__("menu_file_export"),
                role:"export",
                iconfont:"icofont-sign-out  icofont-md",
                enabled:false
            },
            {
                label:interpreter.__("menu_project_settings"),
                role:"project_settings",
                iconfont:"icofont-options  icofont-md",
                enabled:false
            },
        ]
    },
    {
        label:interpreter.__("menu_tool"),
        role:"tool",
        submenu:[
            {
                label:interpreter.__("menu_tool_generate"),
                iconfont:"fs-web",
                submenu:[
                    {
                        label:interpreter.__("menu_tool_generate_captcha"),
                        role:"captcha"
                    }
                ]
            },
            {
                label:interpreter.__("project_load_data"),
                submenu:[
                    {
                        label:interpreter.__("project_load_mnist"),
                        role:"loadMnist"
                    }
                ]
            },
        ]
    },
    {
        label:interpreter.__("menu_help"),
        role:"help",
        submenu:[
            {
                label:interpreter.__("menu_help_visit"),
                iconfont:"icofont-github icofont-md",
                role:"homepage"
            },
            {
                label:interpreter.__("menu_help_contact"),
                iconfont:"icofont-contacts   icofont-md", 
                role:"service",
                visible: interpreter.__("lang") === 'zh-CN'
            },
            {
                label:interpreter.__("menu_help_about"),
                iconfont:"icofont-info-circle   icofont-md", 
                role:"version"
            }
        ]
    }
]

rendererObj.Menu.onclick = function(item,focusedWindow,event){
    $("#nav-menu").trigger("menu.rendererObj",[item.role]);
}

rendererObj.Menu.menuItems = {};
rendererObj.Menu.show = function(role){
    var menuItem = rendererObj.Menu.menuItems[role];
    if(menuItem){
        if(process.platform == "darwin"){
            menuItem.visible = true;
        }else{
            menuItem.removeClass("hidden")
        }
    }
}

rendererObj.Menu.hide = function(role){
    var menuItem = rendererObj.Menu.menuItems[role];
    if(menuItem){
        if(process.platform == "darwin"){
            menuItem.visible = false;
        }else{
            menuItem.addClass("hidden")
        }
    }
}

rendererObj.Menu.enable = function(role){
    var menuItem = rendererObj.Menu.menuItems[role];
    if(menuItem){
        if(process.platform == "darwin"){
            menuItem.enabled = true;
        }else{
            menuItem.removeClass("disabled")
        }
    }
}

rendererObj.Menu.disable = function(role){
    var menuItem = rendererObj.Menu.menuItems[role];
    if(menuItem){
        if(process.platform == "darwin"){
            menuItem.enabled = false;
        }else{
            menuItem.addClass("disabled")
        }
    }
}

rendererObj.Menu.create = function(menus,parent){
    if(typeof menus == "undefined"){
        menus = rendererObj.Menu.template;
    }
    if(typeof parent == "undefined"){
        parent = $("#nav-menu");
    }
    for(var i = 0;i<menus.length;i++){
        var menu = menus[i];
        var menuItem = $("<li></li>").appendTo(parent);
        if(menu.role){
            menuItem.data("role",menu.role);
            rendererObj.Menu.menuItems[menu.role] = menuItem;
        }
        if(menu.enabled === false){
            menuItem.addClass("disabled");
        }
        if(menu.visible === false){
            menuItem.addClass("hidden");
        }
        if(menu.accelerator){
            menuItem.attr("accelerator",menu.accelerator);
        }
        if(menu.type == "separator"){
            menuItem.addClass("separator");
        }else{    
            var menuIcon = $("<i class='icon'></i>").appendTo(menuItem);        
            if(menu.iconfont){
                menuIcon.addClass("fs "+menu.iconfont);
            }
            $("<label>"+menu.label+"</label>").appendTo(menuItem);
            if(menu.submenu){
                $("<i class='indicator fs fs-angle-right'></i>").appendTo(menuItem);
                var subParent = $("<ul></ul>").appendTo(menuItem);
                rendererObj.Menu.create(menus[i].submenu,subParent);
            }else if(menu.accelerator && !menu.sublabel){
                $("<label class='sublabel'>"+menu.accelerator+"</label>").appendTo(menuItem);
            }
        }
    }
    
    if(parent.is("#nav-menu")){
        parent.children("li").on("click",function(ev){
            rendererObj.body.toggleClass("menu-on");
            $(this).toggleClass("expand");
            ev.stopPropagation();
        }).on("mouseover",function(){
            if(rendererObj.body.hasClass("menu-on") && !$(this).hasClass("expand")){
                parent.children("li.expand").removeClass("expand");
                $(this).addClass("expand");
            }
        }).on("click","li",function(ev){
            var $target = $(ev.currentTarget);
            if($target.is(".disabled")){
                ev.stopImmediatePropagation();
                return;
            }
            var role = $target.data("role");
            if(role){
                parent.trigger("menu.rendererObj",[role]);
            }
        })

        rendererObj.body.on("click",function(){
            if(rendererObj.body.hasClass("menu-on")){
                rendererObj.body.removeClass("menu-on");
                parent.children("li.expand").removeClass("expand");
            }
        }).on("keydown",function(ev){

        })
    }
}

$(function () {
    rendererObj.Menu.create();
    rendererObj.body.on("menu.rendererObj",function(ev, role){ 
       if(role == "new"){
            rendererObj.openUrl(rendererObj.url("New","project"),"New-Project-Window",{
                width: 700,
                height: 520,
                //width: 800,
                //height: 800,
                alwaysOnTop:true,
                webPreferences: {
                    nodeIntegration: true,
                },
                frame: false,
                resizable: false
            });
        }
        else if(role == "import_file"){
            let requestId = "DialogRequest_" +rendererObj.time + new Date().getTime();
            rendererObj.once("Dialog.confirm",function(args){
                if(requestId == args.requestId ) {
                    if (args.result == undefined ){
                        console.log(" Result Undefined ");
                    }
                    else{
                        console.log(args.result);
                    }
                }
            });
            let options = { title : interpreter.__('app_name'),
                            filters : [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
                            properties : ['openFile','multiSelections ']
            }
            rendererObj.dialogshow(window.name,options,requestId,"Dialog.confirm");
        }
        else if(role == "import_folder"){
            let requestId = "DialogRequest_" +rendererObj.time + new Date().getTime();
            rendererObj.once("Dialog.confirm",function(args){
                if(requestId == args.requestId ) {
                    if (args.result == undefined ){
                        console.log(" Result Undefined ");
                    }
                    else{
                        console.log(args.result);
                    }
                }
            });
            let options = { title : interpreter.__('app_name'),
                            filters : [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
                            properties : ['openDirectory']
            }
            rendererObj.dialogshow(window.name,options,requestId,"Dialog.confirm");
        }   
        else if(role == "export"){
            $.toast(interpreter.__('module_support_msg'));
        }
        else if(role == "loadMnist"){
            $.toast(interpreter.__('module_support_msg'));
        }
        else if(role == 'upload'){
            $.toast(interpreter.__('module_support_msg'));
        }
        else if(role == 'project_settings'){
            $.toast(interpreter.__('module_support_msg'));
        }
        else if(role == "homepage"){
            rendererObj.openExternal(interpreter.__('home_page'));
        }
        else if(role == "service"){
            $.toast(interpreter.__('module_support_msg'));
        }
        else if(role == 'version'){
            rendererObj.openUrl(rendererObj.url("About","main"),"About-Window",{
                width: 350,
                height: 320,
                modal: false,
                frame: false,
                resizable: false,
                alwaysOnTop:true,
                webPreferences: {
                    nodeIntegration: true,
                },
            })
        }
    });

    rendererObj.on('enableMenu',function (role) {
        rendererObj.Menu.enable(role);
    });

    rendererObj.on('disableMenu',function (role) {
        rendererObj.Menu.disable(role);
    });

   
})
