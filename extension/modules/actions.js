var EXPORTED_SYMBOLS = ["loadActions", "showPage", "setHome", "goHome", "stopWindowName", "setQuit", "showCall", "SELECTIONS_PAGE_PROP"];

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
const scan = {}
Components.utils.import("resource://modules/scan.js", scan);

const SELECTIONS_PAGE_PROP = 'selectionsPage';

var g_strHomeUrl;
function setHome(strUrl)
{ 
    g_strHomeUrl = strUrl;
}
function goHome()
{ 
    showPage(g_strHomeUrl);
}

var g_onQuit;
function setQuit(onQuit)
{ 
    g_onQuit = onQuit;
}

function showPage(page /*...*/)
{
    var args = [];
    var i;
    for (i=1; i < arguments.length; i++)
    {
        var str = config.parseURI(arguments[i])
        var ar=[];
        if (path.expandURI(str, ar)) // parse files to page (for players)
        {
            ar.forEach(function(item){ args.push(item.URI); });
        }
        else
        {
            args.push(str);         // copy to a real array
        }
    }
    mainwindow.setProp("args", args); // pass args to new window

    var fpage = page;
    var prefs = utils.getService("@mozilla.org/preferences-service;1", "nsIPrefBranch");
    const bConfig = prefs.getBoolPref("maavis.commandline.config");
    if (!bConfig)
    {
        // get scan version of file
        var arPage = fpage.split('.');
        arPage[0] += (config.getUserConfig().userType == 'scan') ? '-scan' : '';
        fpage = arPage.join('.');
    }
    var pageURI = config.getPageUrl(fpage);
    
    mainwindow.loadPage(pageURI);
}

function nextSelectionsPage( /*...*/)
{
    var curpage =  mainwindow.getProp(SELECTIONS_PAGE_PROP);
    curpage = parseInt(curpage);
    curpage = (isNaN(curpage)) ? '0' : curpage;
    const pad = window.document.getElementsByTagName('touchpad')[0];
    curpage = (curpage >= pad.lastSelectionsPage) ? 0 : curpage+1;
    mainwindow.setProp(SELECTIONS_PAGE_PROP, curpage.toString() );
    mainwindow.reloadPage();
}

    
var window = undefined;

const that = this;
function setContext()
{
    // set a [partial] global context for current page - need to use window eexplicitly
    window = mainwindow.getWindow();// so in scope chain
    return that;                  // becomes this
}

function loadActions()
{
    //TODO make these methods on objects
    
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
    action.setAction('mediaPlayItem', function(item){ window.document.getElementById("player").playItem(item)}, setContext);

    action.setAction('masterVolumeLouder', function(){ alterMasterVolume( false ) }, setContext);
    action.setAction('masterVolumeQuieter', function(){ alterMasterVolume( true ) }, setContext);

    action.setAction('browseTo', function(page){ window.document.getElementById("browser").loadURI(page)}, setContext);
    action.setAction('browseBack', function(){ window.document.getElementById("browser").goBack()}, setContext);
    action.setAction('browseForward', function(){ window.document.getElementById("browser").goForward()}, setContext);
    action.setAction('browseReload', function(){ window.document.getElementById("browser").reload()}, setContext);
    action.setAction('browseZoomIn', function(){ window.document.getElementById('browser').markupDocumentViewer.fullZoom += .3;}, setContext);
    action.setAction('browseZoomOut', function(){ window.document.getElementById('browser').markupDocumentViewer.fullZoom -= .3;}, setContext);
    action.setAction('browseScrollUp', function(){ window.document.getElementById('browser').contentWindow.scrollBy(0, -window.innerHeight*.75);}, setContext);
    action.setAction('browseScrollDown', function(){ window.document.getElementById('browser').contentWindow.scrollBy(0, window.innerHeight*.75);}, setContext);
    action.setAction('browseScrollLeft', function(){ window.document.getElementById('browser').contentWindow.scrollBy(-window.innerWidth*.75, 0);}, setContext);
    action.setAction('browseScrollRight', function(){ window.document.getElementById('browser').contentWindow.scrollBy(window.innerWidth*.75, 0);}, setContext);

    action.setAction('voipCall', function(vid){ if (skype.isAvailable) { skype.call(vid); showCall(true); } }, setContext);
    action.setAction('voipAnswerCall', function(){ if (skype.isAvailable) skype.answerCall(); }, setContext);
    action.setAction('voipEndCall', function(){ if (skype.isAvailable) skype.endCall(); }, setContext);

    function exec(progs)
    {
        scan.holdScan(3000, execute.killProc);
        const page = (config.getUserConfig().userType == 'scan') ? null : config.getPageUrl("stop.xul");
        var arProgs = progs.split(';');
        execute.execProgs(arProgs, page, scan.releaseScan);
    }
    action.setAction('progExec', exec, setContext);
    action.setAction('progKill',  execute.killProc, setContext);

    action.setAction('configToggleTheme', function(){config.toggleTheme(); goHome()} , setContext);
    action.setAction('configTogglePlayStartSound', function(){config.togglePlayStartSound(); goHome()} , setContext);
    action.setAction('configToggleSpeakTitles', function(){config.toggleSpeakTitles(); goHome()} , setContext);
    action.setAction('configToggleSpeakLabels', function(){config.toggleSpeakLabels(); goHome()} , setContext);
    action.setAction('configToggleShowLabels', function(){config.toggleShowLabels(); goHome()} , setContext);
    action.setAction('configToggleShowImages', function(){config.toggleShowImages(); goHome()} , setContext);
    action.setAction('configToggleUseSkype', function(){config.toggleUseSkype(); goHome()} , setContext);
    action.setAction('configToggleUserType', function(){config.toggleUserType(); goHome()} , setContext);
    action.setAction('configToggleNSwitches', function(){config.toggleNSwitches(); goHome()} , setContext);
    action.setAction('configToggleScanMode', function(){config.toggleScanMode(); goHome()} , setContext);
    //action.setAction('configToggleComplexity', function(){toggleComplexity() ; goHome();}, setContext);

    action.setAction('nextSelectionsPage', nextSelectionsPage, setContext);
    
    action.setAction('logout', function(){ if (g_onQuit) g_onQuit();}, setContext);

    //action.setAction('custom', function(){ arguments[0]();  }, setContext); //TODO fragile
}

function showCall(bShow, partner)
{
    const document = mainwindow.getWindow().document;
    const pad = document.getElementsByTagName('touchpad')[0];
    if (pad !== undefined)
    {
        function _enableAnswerCall(text)
        {
            var enable = (text && text.length);
            var ac = pad.content.getElementsByClassName("answer")[0];
            if (ac)
            {
                ac.setAttribute("disabled", enable ? "false" : "true");
                if (enable)
                {
                    ac.oldLabel = ac.label;
                    ac.label += "\n" + text;
                }
                else if (!enable && ac.oldLabel)
                {
                    ac.label = ac.oldLabel;
                    delete ac.oldLabel;
                }
            }
        }

        _enableAnswerCall(partner);
        const endcall = pad.content.getElementsByClassName("endcallbutton")[0];
        if (endcall)
            endcall.setAttribute('hidden', (bShow) ? 'false' : 'true');
    }
}

function alterMasterVolume(bDec)
{
    bDec = bDec || false;
    
    const tts = Components.classes["@fullmeasure.co.uk/tts;1"]
                         .getService(Components.interfaces.ITTS);

    tts.alterMasterVolume(bDec); 
}
// EOF