function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    window.sizeToContent() 

    actions.loadActions();
    actions.setHome("home.xul");
    
    skype.init();
    
    const splashtime = 6;
    mainwindow.showWindow(window, function(){actions.goHome();}, splashtime);
}

window.addEventListener('load', initWindow, false);

