function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    actions.loadActions("home.xul");
    
    var skype = {};
    Components.utils.import("resource://modules/skype.js", skype);
    var utils = {};
    Components.utils.import("resource://modules/utils.js", utils);
    skype.init();
    skype.addCallStatusObserver(utils.bind(this, function(status){alert(status);}))
    
   mainwindow.showWindow(window, function(){actions.goHome();});
}

window.addEventListener('load', initWindow, false);

