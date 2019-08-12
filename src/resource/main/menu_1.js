const customTitlebar = require('custom-electron-titlebar');

const menu = new Menu();
let MyTitleBar = new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#363636'),
    shadow: true,
    icon: 'D:/nodejs/Groot/src/image/icon.png'
});

MyTitleBar.updateTitle(' Groot ');

menu.append(new MenuItem({
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
}));

MyTitleBar.updateMenu(menu);

menu.on.click = function(item,focusedWindow,event){
    $(".menubar").trigger("menu.rendererObj",[item.role]);
}

$("#page-main-index").on("menu.rendererObj",function(ev, role){ 
    if(role == "new"){
        console.log(" This Project tab");
    }
});