var EXPORTED_SYMBOLS = ["exec", "execProc", "killProc" ];

const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const config = {};
Components.utils.import("resource://modules/config.js", config);
const action = {}
Components.utils.import("resource://modules/action.js", action);

function runProcess(path, args, block)
// the native runner
{
    var process = Components.classes["@mozilla.org/process/util;1"].
        createInstance(Components.interfaces.nsIProcess);
    process.init(path);
    process.run(block, args, args.length);
}

function exec(command)
// James Boston's improved runner (with tweaks form me)
{
    var pm = Components.classes["@senecac.on.ca/processmanager;1"].
        createInstance(Components.interfaces.IProcessManager);
    pm.start(command);
    return pm;
}


// just a single process
var g_proc = undefined;
var g_poller = undefined;

function pollProc()
{
    setTopmost();
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
    window.document.getElementById('wnd').setAttribute('collapsed', 'false');
}

function startProcPoller()
{
    if (!g_poller)
    {
        g_poller = window.setInterval( function(){ pollProc();}, 1000);
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

const stopWindowName = "Stop!";

function setTopmost()
{
    g_proc.makeTopmost();
    g_proc.makeMozWindowTopmost(stopWindowName);
}

var window = undefined;

function setContext()
{
    // set a [partial] global context for current page - need to use window eexplicitly
    window = mainwindow.getWindow();// so in scope chain
}

function execProc(prog)
{
    setContext();
    
    if (g_proc)
    {
        utils.logit("A process is already running");
        return;
    }
        
    g_proc = exec(prog);
    startProcPoller();
    stopper = window.open("chrome://sim_win/content/stop.xul", "stop", "chrome,top=0,left=0,titlebar=no,alwaysRaised" ); // can't be modal or interval not seen
    window.document.getElementById('wnd').setAttribute('collapsed', 'true');
    window.setTimeout(setTopmost, 1000); //alow everything to start up
}

// EOF