var EXPORTED_SYMBOLS = ["showWindow", "loadPage", "setWindow", "getWindow", "getDocument()", "getElementById", "setProp", "getProp", "alert", "logit"];

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
//        _window.document.title = "SIM WIN - " + pa;
}

var _props = {};

function setProp(name, value)
{
    _props[name] = value;
}

function getProp(name)
{
    return _props[name];
}

function alert(str)
{
  _window.alert(str);
}

function logit(str)
{
  utils.logit(str);
}