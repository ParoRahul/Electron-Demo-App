const menubar = require ('./menubar.js');
const fs = require('fs');

(function(){
    $(".menubar").on("menuitem-clicked",function(event){
        event.stopImmediatePropagation();

        if(event.detail.role == "newimage" ){
            rendererObj.dialogOpen({ title : 'backdoor',
                                     filters : [ { name: 'Images', extensions: ['jpg', 'png', 'JPEG'] }],
                                     properties : ['openFile','multiSelections']}).
            then (function (result){
            if (result.canceled == false ){
                console.log(` Result is ${result.filePaths}`);
            }
            else{
                console.log('Result is cancelled');
            }
            }).catch(function(err){
                console.log(err);
            })
        }
        else if (event.detail.role == "folder" ) {
            rendererObj.dialogOpen({ title : 'backdoor', 
                                     filters : [],
                                     properties : ['openDirectory'] }).
            then (function (result){
                    if (result.canceled == false ){
                        console.log(` Result is ${result.filePaths}`);
                    }
                    else{
                        console.log('Result is cancelled');
                    }
            }).catch(function(err){
                console.log(err);
            })              
        }
        else if (event.detail.role == "save" ) {
            var copyText = document.getElementById("codetext");
            copyText.select();
            document.execCommand("copy");
            rendererObj.dialogSave({ title : 'backdoor',
                                     filters : [ {name: 'text Type', extensions: ['txt']}  ]
            }).then (function (result){
                    if (result.canceled == false ){
                        console.log(` Result is ${result.filePath}`);
                        fs.writeFile(result.filePath, copyText.value, function (err) {
                            if (err) throw err;
                        });
                    }
                    else{
                        console.log('Result is cancelled');
                    }
            }).catch(function(err){
                console.log(err);
            })              
        }
        else if (event.detail.role == "exit" ) {
            let id = currentWin.id;
            rendererObj.close(id);
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