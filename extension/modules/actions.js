var EXPORTED_SYMBOLS = ["loadActions", "showPage", "setHome", "goHome", "stopWindowName", "getColour", "getSpeech", "getComplexity", "getPlaylist", "setQuit", "showCall"];

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
        ar=[];
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

    action.setAction('masterVolumeLouder', function(){ alterMasterVolume( false ) }, setContext);
    action.setAction('masterVolumeQuieter', function(){ alterMasterVolume( true ) }, setContext);

    action.setAction('playlistAdd', playlistAdd, setContext);

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

    action.setAction('configToggleColour', function(){toggleColour(); goHome()} , setContext);
    action.setAction('configToggleSpeech', function(){toggleSpeech(); goHome()} , setContext);
    //action.setAction('configToggleComplexity', function(){toggleComplexity() ; goHome();}, setContext);
 
    action.setAction('logout', function(){ if (g_onQuit) g_onQuit();}, setContext);
}

function showCall(bShow, partner)
{
    const document = mainwindow.getWindow().document;
    
    function _enableAnswerCall(text)
    {
        enable = (text && text.length);
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

function getColour()
{
    const files = getColourFiles("colour");
    return (areFileTimesTheSame(files.src, files.dst)) ? "colour" : "bw"; 
}

function getSpeechFile()
{
    var fileNoSpeech = config.getUserDataDir();
    fileNoSpeech.append('.nospeech');
    return fileNoSpeech;
}

function getSpeech()
{
    const file = getSpeechFile();
    return (file.exists()) ? "nospeech" : "speech"; 
}

function toggleSpeech()
{
    try 
    {
        const file = getSpeechFile();
        if (file.exists())
            file.remove(false);
        else
            file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
    }
    catch(e)
    {
        utils.logit("Can't change speech");
        throw (e);        
    }
}

function getComplexity()
{
    const files = getComplexityFiles("full");
    return (areFileTimesTheSame(files.src, files.dst)) ? "full" : "reduced";
}

function areFileTimesTheSame(fileA, fileB)
{
   return fileA.lastModifiedTime == fileB.lastModifiedTime;
}

function getColourFiles(colour)
{
    try 
    {
        const root = 'file:///' + path.getExtensionRootPath() + '\\chrome\\skin\\';
        const src = 'maavis_' + colour + '.css';
        const dst = 'maavis.css';
        // todo remove hard coding
        const ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        const srcURI = ios.newURI(root+src, null, null);
        const srcFile = srcURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        const dstURI = ios.newURI(root+dst, null, null);
        const dstFile = dstURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        return {src: srcFile, dst: dstFile};
    }
    catch(e)
    {
        utils.logit("Can't get colour files");
        return {};        
    }
}

function getComplexityFiles(complexity)
{
    try 
    {
        const root = 'file:///' + path.getExtensionRootPath() + '\\chrome\\content\\';
        const src = 'maavis_' + g_complexity;
        const dst = 'maavis';
        // todo remove hard coding
        const ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        const srcURI = ios.newURI(root+src, null, null);
        const srcFile = srcURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        const dstURI = ios.newURI(root+dst, null, null);
        const dstFile = dstURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        return {src: srcFile, dst: dstFile};
    }
    catch(e)
    {
        utils.logit("Can't get complexity files");
        throw(e);
        return {};        
    }
}


var g_complexity = 'full';
function toggleComplexity(g_complexity)
{
    g_complexity = (g_complexity == "reduced") ? "full" : 'reduced';

    try 
    {
        files = getComplexityFiles();
        files.dst.remove(true);
        files.src.copyTo(null, 'maavis');
    }
    catch(e)
    {
        utils.logit("Can't change complexity");
        throw (e);        
    }
}

var g_colour = 'colour';
function toggleColour()
{
//    g_complexity = (g_complexity == "minimal) ? "full" : 'minimal';
    g_colour = (g_colour == "colour") ? "bw" : 'colour';

    try 
    {
        files = getColourFiles(g_colour);
        
        files.dst.remove(false);
        files.src.copyTo(null, 'maavis.css');
    }
    catch(e)
    {
        utils.logit("Can't change theme");
        throw (e);        
    }
}

var g_playlist = [];
function getPlaylist()
{
    return g_playlist;
}

function playlistAdd(item)
{
    //TODO toggle?
    g_playlist.push(item);
}


function alterMasterVolume(bDec)
{
    bDec = bDec || false;
    
    const tts = Components.classes["@fullmeasure.co.uk/tts;1"]
                         .getService(Components.interfaces.ITTS);

    tts.alterMasterVolume(bDec); 
}
// EOF