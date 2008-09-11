var EXPORTED_SYMBOLS = ["loadActions", "showPage", "goHome", "stopWindowName" ];

const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const config = {};
Components.utils.import("resource://modules/config.js", config);
const path = {};
Components.utils.import("resource://modules/path.js", path);
const file = {};
Components.utils.import("resource://modules/file.js", file);
const action = {}
Components.utils.import("resource://modules/action.js", action);
const execute = {}
Components.utils.import("resource://modules/execute.js", execute);
const skype = {}
Components.utils.import("resource://modules/skype.js", skype);

var g_strHomeUrl;

function setHome(strUrl)
{ 
    g_strHomeUrl = strUrl;
}

function goHome()
{ 
    showPage(g_strHomeUrl);
}

function showPage(page /*...*/)
{
    args = [];
    for (i=1; i < arguments.length; i++)
    {
        var str = config.parseURI(arguments[i])
        ar=[];
        if (path.expandURI(str, ar))
        {
            args.push(ar);
        }
        else
        {
            args.push(str);         // copy to a real array
        }
    }
    mainwindow.setProp("args", args); // pass args to new window
   
    const fpage = "chrome://sim_win/content/" + page;
    mainwindow.loadPage(fpage);
}

    
var window = undefined;

function setContext()
{
    // set a [partial] global context for current page - need to use window eexplicitly
    window = mainwindow.getWindow();// so in scope chain
    return window;                  // becomes this
}

function loadActions(homePage)
{
    setHome(homePage);

    action.setAction('goHome', goHome, setContext);
    action.setAction('showPage', showPage, setContext);
    action.setAction('mediaPause', function(){ window.document.getElementById("player").togglePause()}, setContext);
    action.setAction('mediaRestart', function(){ window.document.getElementById("player").restart()}, setContext);
    action.setAction('mediaToggleMute', function(){ window.document.getElementById("player").toggleMute()}, setContext);
    action.setAction('mediaSetVolume', function(){ window.document.getElementById("player").setVolume()}, setContext);
    action.setAction('mediaLouder', function(){ window.document.getElementById("player").incVolume()}, setContext);
    action.setAction('mediaQuieter', function(){ window.document.getElementById("player").decVolume()}, setContext);
    action.setAction('mediaPrev', function(){ window.document.getElementById("player").prevItem()}, setContext);
    action.setAction('mediaNext', function(){ window.document.getElementById("player").nextItem()}, setContext);

    action.setAction('browseTo', function(page){ window.document.getElementById("browser").loadURI(page)}, setContext);
    action.setAction('browseBack', function(){ window.document.getElementById("browser").goBack()}, setContext);
    action.setAction('browseForward', function(){ window.document.getElementById("browser").goForward()}, setContext);
    action.setAction('browseReload', function(){ window.document.getElementById("browser").reload()}, setContext);

    action.setAction('voipCall', function(vid){ if (skype.isAvailable) skype.call(vid); }, setContext);
    action.setAction('voipAnswerCall', function(){ if (skype.isAvailable) skype.answerCall(); }, setContext);
    action.setAction('voipEndCall', function(){ if (skype.isAvailable) skype.endCall(); }, setContext);

    action.setAction('progExec', execute.execProc, setContext);
    action.setAction('progKill', execute.killProc, setContext);
}

// EOF