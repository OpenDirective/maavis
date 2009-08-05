var EXPORTED_SYMBOLS = ["loadActions", "showPage", "setHome", "goHome", "stopWindowName", "setQuit", "showCall"];

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
        if (path.expandURI(str, ar))
        {
            ar.forEach(function(item){ args.push(item.URI); });
        }
        else
        {
            args.push(str);         // copy to a real array
        }
    }
    mainwindow.setProp("args", args); // pass args to new window
   
    const fpage = config.getPageUrl(page);
    mainwindow.loadPage(fpage);
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

    action.setAction('progExec', execute.execProc, setContext);
    action.setAction('progKill', execute.killProc, setContext);

    action.setAction('configToggleColour', function(){config.toggleColour(); goHome()} , setContext);
    action.setAction('configToggleSpeech', function(){config.toggleSpeech(); goHome()} , setContext);
    //action.setAction('configToggleComplexity', function(){toggleComplexity() ; goHome();}, setContext);
 
    action.setAction('logout', function(){ if (g_onQuit) g_onQuit();}, setContext);
}

function showCall(bShow, partner)
{
    const document = mainwindow.getWindow().document;
    
    function _enableAnswerCall(text)
    {
        var enable = (text && text.length);
        var ac = document.getElementsByClassName("answer");
        if (ac.length && ac[0])
        {
            ac = ac[0];
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
    const endcall = document.getElementById("endcall");
    if (endcall)
        endcall.setAttribute('hidden', (bShow) ? 'false' : 'true');
}

function alterMasterVolume(bDec)
{
    bDec = bDec || false;
    
    const tts = Components.classes["@fullmeasure.co.uk/tts;1"]
                         .getService(Components.interfaces.ITTS);

    tts.alterMasterVolume(bDec); 
}
// EOF