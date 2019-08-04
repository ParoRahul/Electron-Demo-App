/**
 * coding: utf-8 
 * Created on Sat May 11 11:03:45 2019
 * author: Rahul
 * 
 */

if(rendererObj.is("dialog-confirm")){
    let requestId = '';
    let parentWindow = null;
    rendererObj.on('window.confirm',function (data) {
        $(".confirm-text").html(data.text);
        requestId = data.requestId;
        parentWindow = data.parent;
        rendererObj.show();
    });

    $("#btn-ok").on('click',function () {
        rendererObj.send('window.confirm.return',{requestId:requestId},parentWindow);
        //rendererObj.close(parentWindow);
        rendererObj.hide();
    });

    $("#btn-cancel").on('click',function () {
        rendererObj.hide();
    });

    $(".btn-exit").on('click',function (ev) {
        ev.stopImmediatePropagation();
        rendererObj.hide();
    });
}