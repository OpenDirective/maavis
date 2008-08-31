var EXPORTED_SYMBOLS = ["loadActions", "showPage", "goHome" ];

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


function voipCall(vid /*...*/)
{
    this.mainwindow.alert("called: " + vid);
    this.file.launchFile("C:\\boot.ini");
}


// just a single process
var g_proc = undefined;
var g_poller = undefined;

function pollProc()
{
    if( g_proc && !g_proc.isRunning())
    {
        stopProcPoller();
        restoreApp();
    }
}

function restoreApp()
{
    g_proc = undefined;
    stopper.close();
    window.restore();
}

function startProcPoller()
{
    if (!g_poller)
    {
        g_poller = window.setInterval( function(){ pollProc();}, 2000);
    }
}

function stopProcPoller()
{
    if (g_poller)
    {
        window.clearInterval(g_poller);
        g_poller = undefined;
    }
}

var stopper = undefined;

function killProc()
{
    if (!g_proc)
        return;
        
    stopProcPoller();
    g_proc.stop();
    restoreApp();
 }   

function execProc(prog)
{
    if (g_proc)
    {
        utils.logit("A process is already running");
        return;
    }
        
    g_proc = utils.exec(prog);
    startProcPoller();
     
    stopper = window.open("chrome://sim_win/content/stop.xul", "stop", "chrome,top=0,left=0,titlebar=no,alwaysRaised" ); // can't be modal or interval not seen
    window.minimize();
    }
    
var window = undefined;

function setcontext()
{
    // set things up so actions appear to run in the usual context for the current page
    window = mainwindow.getWindow();// so in scope chain
    window.window = window;         // as the DOM does
    return window;                  // becomes this
}

function loadActions(homePage)
{
    setHome(homePage);

    action.setAction('goHome', goHome, setcontext);
    action.setAction('showPage', showPage, setcontext);
    action.setAction('mediaPause', function(){ window.document.getElementById("player").togglePause()}, setcontext);
    action.setAction('mediaRestart', function(){ window.document.getElementById("player").restart()}, setcontext);
    action.setAction('mediaToggleMute', function(){ window.document.getElementById("player").toggleMute()}, setcontext);
    action.setAction('mediaSetVolume', function(){ window.document.getElementById("player").setVolume()}, setcontext);
    action.setAction('mediaLouder', function(){ window.document.getElementById("player").incVolume()}, setcontext);
    action.setAction('mediaQuieter', function(){ window.document.getElementById("player").decVolume()}, setcontext);
    action.setAction('mediaPrev', function(){ window.document.getElementById("player").prevItem()}, setcontext);
    action.setAction('mediaNext', function(){ window.document.getElementById("player").nextItem()}, setcontext);

    action.setAction('browseTo', function(page){ window.document.getElementById("browser").loadURI(page)}, setcontext);
    action.setAction('browseBack', function(){ window.document.getElementById("browser").goBack()}, setcontext);
    action.setAction('browseForward', function(){ window.document.getElementById("browser").goForward()}, setcontext);
    action.setAction('browseReload', function(){ window.document.getElementById("browser").reload()}, setcontext);

    action.setAction('voipCall', voipCall, setcontext);

    action.setAction('progExec', execProc, setcontext);
    action.setAction('progKill', killProc, setcontext);
}

