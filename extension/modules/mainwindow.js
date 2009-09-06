var EXPORTED_SYMBOLS = ["showWindow", "quit", "loadPage", "reloadPage", "setWindow", "getWindow", "getDocument()", "getElementById", "setProp", "getProp", "alert", "logit"];

var winutils = {};
Components.utils.import("resource://modules/winutils.js", winutils);
var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

var _window = undefined;

function showWindow(window, callback, splashtime)
{
    setWindow(window);
    const bKiosked = Boolean(winutils.getWindowIntArgument(window, 0));
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    var mwindow = window;
    if (bKiosked)
    {
	function func()
	{
	     winutils.setWindowFullscreen(mwindow);
	}
	window.setTimeout(func, 1); // must be async to work and cover Windows task bar
    }
    if (callback)
    {
        function func()
        {
           callback(mwindow);// NOTE: there may be a fullscreen event we could use
        }
        window.setTimeout(func, splashtime * 1000); // must be async to work and cover Windows task bar
    }
}

function quit (aForceQuit)
{
  var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
    getService(Components.interfaces.nsIAppStartup);

  // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
  // process if there is unsaved data. eForceQuit will quit no matter what.
  var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                  Components.interfaces.nsIAppStartup.eAttemptQuit;
  appStartup.quit(quitSeverity);
}


function setWindow(window)
{
  _window = window;
}

function getWindow(page)
{
  return _window;
}

function getDocument(page)
{
  return _window.document;
}

function getElementById(id)
{
  return _window.document.getElementById(id);
}

function loadPage(page)
{
    // NB this kills global objects like timers - a new page needs to call setWindow().
    _window.location.replace(page);
//        const path = _window.document.location.pathname;
}

function reloadPage(page)
{
    // NB this kills global objects like timers - a new page needs to call setWindow().
    _window.location.reload(true);
}

var _props = {};

function setProp(name, value)
{
    _props[name] = value;
}

function getProp(name)
{
    if (name in _props) // this way to stop warnings in console
        return _props[name];
    else
        return undefined;
}

function alert(str)
{
  _window.alert(str);
}

function logit(str)
{
  utils.logit(str);
}