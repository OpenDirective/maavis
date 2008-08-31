function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    actions.loadActions("home.xul");
    
    mainwindow.showWindow(window, function(){actions.goHome();});
}

window.addEventListener('load', initWindow, false);

