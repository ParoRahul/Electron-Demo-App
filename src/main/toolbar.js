(function(){
    $(".upper-toolbar").on("toolaction", function(event,actiontype){        
        if (actiontype=='manageUser'){
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
        else if(actiontype=='appLock')
            console.log(` Action triggered ${actiontype}`) 
        else
            console.log(` Action triggered ${actiontype}`) 
    });

    config.upperToolbar.forEach(function(mitem) {
        $(".upper-toolbar").append(`<li class=${mitem.id} data-toggle="tooltip" 
                                                          data-placement="right" 
                                                          title=${mitem.title}>
                                        <i class="material-icons">${mitem.icon}</i>
                                    </li>`);
        $(".upper-toolbar").on("click", `li.${mitem.id}` , function(event) {
            $(".upper-toolbar").trigger("toolaction", `${mitem.id}`);
            event.stopImmediatePropagation;
        });                            
    });
    
    config.lowerToolbar.forEach(function(mitem) {
        $(".lower-toolbar").append(`<li class=${mitem.id} data-toggle="tooltip" 
                                                          data-placement="right" 
                                                          title=${mitem.title}>
                                        <i class="material-icons">${mitem.icon}</i>
                                    </li>`);
        $(".lower-toolbar").on("click", `li.${mitem.id}` , function(event) {
            $(".lower-toolbar").trigger("toolaction", `${mitem.id}`);
            event.stopImmediatePropagation;
        });                            
    });

    $('[data-toggle="tooltip"]').tooltip();
    
})()