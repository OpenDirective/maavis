function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    actions.loadActions();
    actions.setHome("home.xul");
    
    skype.init();

    mainwindow.showWindow(window, function(){actions.goHome();});
}

window.addEventListener('load', initWindow, false);

