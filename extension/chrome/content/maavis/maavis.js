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
    const sound = page.config.startsoundURI;
    if (page.config.playStartSound == 'yes' && sound)
    {
        var player = document.createElement('audioplayer');
        player.setAttribute("top", "-1"); // off screen
        player.setAttribute("left","0");
        player.setAttribute("width","1");
        player.setAttribute("height","1");
        player.setAttribute("invisible","true");
        player.setAttribute("id", 'startsoundPlayer');
        document.getElementById("z").appendChild(player);
        player.playOnce = 'true'; // these 2 calls need to be here to work - weird
        player.onPlayerReady = function(){player.play(sound);}; 
    }
}

function initWindow()
{
    window.removeEventListener('load', initWindow, false);

	playStartSound();
    
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

    if(!bConfig && page.config.useSkype == "yes")
    {
        skype.init();
    }
    skype.initJoys();
    
    const splashtime = page.config.splashTime;
    mainwindow.showWindow(window, function(){actions.goHome();}, splashtime);
}

window.addEventListener('load', initWindow, false);

