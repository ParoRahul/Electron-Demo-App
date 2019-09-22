const { ipcRenderer} = require('electron');
(function(){
    $(".upper-toolbar").on("toolaction", function(event,actiontype){        
        if (actiontype=='manageAccount'){
            let windowTitle ='Manage_User'
            ipcRenderer.on("HAHA",(event,{id})=>{
                console.log('displaying Manage_Account');
            });
            ipcRenderer.send("window.open",{windowTitle})
        }
    });

    $(".lower-toolbar").on("toolaction", function(event,actiontype){
        if (actiontype=='settings')
            rendererObj.open('Settings') 
        else if(actiontype=='AppLock')
            console.log(` Action triggered ${actiontype}`) 
        else
            console.log(` Action triggered ${actiontype}`) 
    });

    config.upperToolbar.forEach(function(mitem) {
        $(".upper-toolbar").append(`<li class=${mitem.id}>
                                        <i class="material-icons">${mitem.icon}</i>
                                    </li>`);
        $(".upper-toolbar").on("click", `li.${mitem.id}` , function(event) {
            $(".upper-toolbar").trigger("toolaction", `${mitem.id}`);
            event.stopImmediatePropagation;
        });                            
    });

    config.lowerToolbar.forEach(function(mitem) {
        $(".lower-toolbar").append(`<li class=${mitem.id}>
                                        <i class="material-icons">${mitem.icon}</i>
                                    </li>`);
        $(".lower-toolbar").on("click", `li.${mitem.id}` , function(event) {
            $(".lower-toolbar").trigger("toolaction", `${mitem.id}`);
            event.stopImmediatePropagation;
        });                            
    });
    
})()