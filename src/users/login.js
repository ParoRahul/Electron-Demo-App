'use strict';

(function(){
    if (! rendererObj.is('appUserPage')){
        return;
    }
    
    $('#login-form').on ('submit',function(event){
        event.preventDefault();
        event.stopPropagation();

        if( $('#login-form')[0].checkValidity() === false){
            $('#login-form').addClass('was-validated');
        }
        else{
            console.log("asynchronious Validation");
            let username = $('#userid').val();
            let password = $('#password').val();
            $('#login-form').addClass('was-validated');
        }
    })

    $('#signup').on('click',function(){
        let windowTitle ='Signin_User'
            ipcRenderer.on("HAHA",(event,{id})=>{
                currentWin.close();
            });
        ipcRenderer.send("window.open",{windowTitle})
    })
})()