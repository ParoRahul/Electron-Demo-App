(function(){
    if (! rendererObj.is('appUserPage')){
        return;
    }
    let username = $('#userid').val();
    let password = $('#password').val();
    $('#signup').on('click',function(){
        rendererObj.on('window.addEventListener.Signin_User',()=>{
            rendererObj.close()
        });
        rendererObj.open('Signin_User');
    })
})()