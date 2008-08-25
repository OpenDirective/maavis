var EXPORTED_SYMBOLS = ["showWindow", "loadPage", "getWindow", "getDocument()", "getElementById", "setHome", "goHome", "setProps", "getProps"];

var winutils = {};
Components.utils.import("resource://modules/winutils.js", winutils);

var _window = undefined;

function showWindow(window, callback)
{
    _window = window;
    const bKiosked = Boolean(winutils.getWindowIntArgument(window, 0));
    if (bKiosked)
    {
        var mwindow = window;
        function func()
        {
            winutils.setWindowFullscreen(mwindow);
            if (callback)
            {
                callback(mwindow);// NOTE: there may be a fullscreen event we could use
            }
        }
        window.setTimeout(func, 500); // must be async to work and cover Windows task bar
    }
    else
    {
        if (callback)
            callback(window);
    }
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
    _window.location.replace(page);
//        const path = _window.document.location.pathname;
//        _window.document.title = "SIM WIN - " + path;
}

var _strHomeUrl;

function setHome(strUrl)
{ 
    _strHomeUrl = strUrl;
}

function goHome()
{ 
    loadPage(_strHomeUrl);
}

var _props = {};

function setProps(props)
{
    _props = props;
}

function getProps()
{
    return _props;
}