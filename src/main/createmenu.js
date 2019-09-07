const menubar = require ('./menubar.js');
(function(){
    $(".menubar").on("menuitem-clicked",function(event){
        event.stopImmediatePropagation();
        
        if(event.detail.role == "newimage" ){
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
            let options = { title : 'backdoor',
                            filters : [ { name: 'Images', extensions: ['jpg', 'png', 'JPEG'] }],
                            properties : ['openFile','multiSelections']
                          }
            rendererObj.dialogshow(window.name,options,requestId,"Dialog.confirm");
        }
        else if (event.detail.role == "newimage" ) {

        }
        else if (event.detail.role == "folder" ) {

        }
        else if (event.detail.role == "save" ) {

        }
        else if (event.detail.role == "exit" ) {

        }
        else if (event.detail.role == "view" ) {

        }
        else if (event.detail.role == "help" ) {

        }
        else {

        }
    });

    var Menubar = new menubar(config.menuConfig); 
})()