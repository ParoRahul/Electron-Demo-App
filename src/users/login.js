(function(){
    if (! rendererObj.is('appUserPage')){
        return;
    }
    let username = $('#userid').val();
    let password = $('#password').val();
    $('#signup').on('click',function(){
        rendererObj.open('Signin_User')
    })
})()