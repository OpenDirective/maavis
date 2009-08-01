var winutils = {};
Components.utils.import("resource://modules/winutils.js", winutils);

if (mainwindow.getProp("MaavisMainWindow") === undefined)
    mainwindow.setProp("MaavisMainWindow", "true");
else
    window.close(); // TODO for links opening in _blank until be can resolve

function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    actions.loadActions();

    const bConfig = Boolean(winutils.getWindowIntArgument(window, 1));
    const home = (bConfig) ? "config.xul" : "home.xul"
    actions.setHome(home);
    
    document.getElementById("promptMaavis").setAttribute("collapsed", (bConfig) ? "true" : "false")
    document.getElementById("promptSettings").setAttribute("collapsed", (!bConfig) ? "true" : "false")

    if(!bConfig)
    {
        skype.init();
    }
    
    const splashtime = 4;
    mainwindow.showWindow(window, function(){actions.goHome();}, splashtime);
}

window.addEventListener('load', initWindow, false);

