var EXPORTED_SYMBOLS = ["exec", "execSkype", "killSkype", "setProcessRunningUI", "restoreUI", "execProc", "killProc", "stopWindowName" ];

const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const action = {}
Components.utils.import("resource://modules/action.js", action);
const path = {}
Components.utils.import("resource://modules/path.js", path);

function runProcess(path, args, block)
// the native runner
{
    var process = utils.createInstance("@mozilla.org/process/util;1", "nsIProcess");
    process.init(path);
    process.run(block, args, args.length);
}

function exec(command)
// James Boston's improved runner (with tweaks from me)
{
    var pm = utils.createInstance("@senecac.on.ca/processmanager;1", "IProcessManager");
    
    pm.start(command, null);
    return pm;
}

// just a single process
const g_pm = utils.createInstance("@senecac.on.ca/processmanager;1", "IProcessManager");
var g_poller = undefined;
var g_chkProc = null;

function pollProc()
{
    setTopmost();
    if( g_chkProc && !g_pm.isRunning())
    {
        g_pm.stop();
        restoreUI();
    }
}

function startProcPoller()
{
    if (!g_poller)
    {
        g_poller = window.setInterval( function(){ pollProc();}, 1000);
        if (g_pm)
            g_pm.showTaskBar(false); // hidetask bar immediately
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

function setContentVisibility(isVis)
{
    const v = (isVis) ?  'false' : 'true';
    window.document.getElementsByTagName('window')[0].setAttribute('collapsed', v);
}

var g_stopper = undefined;
var g_onEnd = null;

function setProcessRunningUI(page, onEnd)
{
    if (page)
    {
        g_stopper = window.open(page, stopWindowName, "chrome,top=0,left=0,titlebar=no,alwaysRaised" ); // can't be modal or interval not seen
    }
    g_onEnd = onEnd;
    startProcPoller();
    setContentVisibility(false);
    window.setTimeout(setTopmost, 1000); //alow everything to start up
}

function restoreUI()
{
    stopProcPoller();
    if (g_stopper)
    {
        g_stopper.close();
        g_stopper = undefined;
    }
    if( g_pm)
        g_pm.showTaskBar(true); //show taksbar
    setContentVisibility(true);
    if (g_onEnd)
        g_onEnd();
    g_onEnd = null;
}

const stopWindowName = "Stop!";

function setTopmost()
{
    if (g_pm.isRunning())
    {
        g_pm.makeTopmost();
        g_pm.showTaskBar(false); // hidetask bar
    }
    else
    {
        g_pm.showTaskBar(true); //show taksbar
    }
    if (g_stopper)
        g_pm.makeMozWindowTopmost(stopWindowName); // as set by document.title or window title=
}

var window = undefined;

function setContext()
{
    // set a [partial] global context for current page - need to use window eexplicitly
    window = mainwindow.getWindow();// so in scope chain
}

function execProc(prog, page, onEnd)
{
    setContext();
    
    if (g_pm.isRunning())
    {
        utils.logit("A process is already running");
        return;
    }

        utils.logit('exec: '+dir+' '+prog);

    var dir = null;
    try
    {
        const dirFile = path.getFile(prog);
        dir = dirFile.parent.path; // some programs need current dir setting to their dir
    }
    catch (e)
    {
    }
    //utils.logit('exec: '+dir+' '+prog);
    g_pm.start(prog, dir);
 
    g_chkProc = true; // messy
    setProcessRunningUI(page, onEnd);
}

function killProc()
{   
    setContext();
    stopProcPoller();
    if (g_pm.isRunning())
    {
        g_pm.sendSyntheticKeyEvent(0x73, null, true,false,false); //ALT F4
        g_pm.sendSyntheticKeyEvent(0x1b, null, false,false,false);//ESC
        g_pm.sendSyntheticKeyEvent(0x1b, null, false,false,false);
        g_pm.stop();
    }
    restoreUI();
}   

function execSkype(page)
{
    setContext();
    g_chkProc = false; // messy
    setProcessRunningUI(page);
}

function killSkype()
{
    setContext();
    restoreUI();
}


// EOF