var EXPORTED_SYMBOLS = ["exec", "execSkype", "killSkype", "setProcessRunningUI", "restoreUI", "execProgs", "killProc", "stopWindowName" ];

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

MODE_FIRST = 0
function ProcessManager()
{
    this.mode = MODE_FIRST;
    this.procs = [];
}

ProcessManager.prototype.addProg = function(prog)
{
    const pm = utils.createInstance("@senecac.on.ca/processmanager;1", "IProcessManager");
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
    pm.start(prog, dir);
    this.procs.push(pm);
}

ProcessManager.prototype.runProgs = function(progs)
{
    const that = this;
    progs.forEach(function(prog){that.addProg(prog);});
}

ProcessManager.prototype.isRunning = function()
{
    return this.procs.length && this.procs[0].isRunning();
}

ProcessManager.prototype.stop = function()
{
    const pm = this.procs.length && this.procs[0];
    if (pm && pm.isRunning())
    {
        // be nice to first proc
        pm.sendSyntheticKeyEvent(0x73, null, true,false,false); //ALT F4
        pm.sendSyntheticKeyEvent(0x1b, null, false,false,false);//ESC
        pm.sendSyntheticKeyEvent(0x1b, null, false,false,false);
    }
    this.procs.forEach(function(ob){ob.stop();}); // kill all the others
    this.procs = [];
}

ProcessManager.prototype.makeTopmost = function()
{
    //this.procs.forEach(function(ob){ob.makeTopmost();});
    if (this.procs.length)
        this.procs[0].makeTopmost();
}

ProcessManager.prototype.showTaskBar = function(bShow)
{
    var pm = utils.createInstance("@senecac.on.ca/processmanager;1", "IProcessManager");
    pm.showTaskBar(bShow);
}

ProcessManager.prototype.makeMozWindowTopmost = function(wndName)
{
    var pm = utils.createInstance("@senecac.on.ca/processmanager;1", "IProcessManager");
    pm.makeMozWindowTopmost(wndName);
}

const g_pm = new ProcessManager();
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

function execProgs(arProgs, page, onEnd)
{
    setContext();
    g_pm.runProgs(arProgs);
    g_chkProc = true; // messy
    setProcessRunningUI(page, onEnd);
}

function killProc()
{   
    setContext();
    stopProcPoller();
    g_pm.stop();
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