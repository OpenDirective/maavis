var winutils = {};
Components.utils.import("resource://modules/winutils.js", winutils);
var path = {};
Components.utils.import("resource://modules/path.js", path);
	
if (mainwindow.getProp("MaavisMainWindow") === undefined)
    mainwindow.setProp("MaavisMainWindow", "true");
else
    window.close(); // TODO for links opening in _blank until be can resolve

function playStartSound()
{
    if (page.config.playStartSound == 'yes')
    {
        const player = document.getElementById('player');
        const sound = page.config.startsoundURI;
        if (sound)
            player.onPlayerReady = function(){ player.play([sound]); };
    }
}

function initWindow()
{
    window.removeEventListener('load', initWindow, false);

    actions.loadActions();

    //const bConfig = Boolean(winutils.getWindowIntArgument(window, 1));
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    const bConfig = prefs.getBoolPref("maavis.commandline.config");
    const home = (bConfig) ? "config.xul" : "home.xul"
    actions.setHome(home);
    
    // show correct info on home page
    document.getElementById("promptMaavis").setAttribute("collapsed", (bConfig) ? "true" : "false")
    document.getElementById("promptSettings").setAttribute("collapsed", (!bConfig) ? "true" : "false")

	playStartSound()

    if(!bConfig && page.config.useSkype == "yes")
    {
        skype.init();
    }
    skype.initJoys();
    
    const splashtime = (bConfig) ? 2 : page.config.splashTime;
    mainwindow.showWindow(window, function(){actions.goHome();}, splashtime);
}

window.addEventListener('load', initWindow, false);

