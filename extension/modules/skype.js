var EXPORTED_SYMBOLS = ["init", "shutdown", "isAvailable", "call", "endCall", "videoTest", "answerCall", "setCallStatusObserver", "initJoys", "setJoyStatusObserver"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
var server = {};
Components.utils.import("resource://modules/outfox.js", server);
var ticker = {};
Components.utils.import("resource://modules/ticker.js", ticker);

var _proxy = null;
const _id = 0;
const _id2 = 1;
var _csobserver = null;
var _jsobserver = null;
var g_isAvailable = false;
function isAvailable()
{
	return g_isAvailable;
}

function _checkInstalled()
{
    var bInstalled = false;
    try
    {
        const wrk = Components.classes["@mozilla.org/windows-registry-key;1"]
                            .createInstance(Components.interfaces.nsIWindowsRegKey);
        wrk.open(wrk.ROOT_KEY_CURRENT_USER,
                 "SOFTWARE\\Skype\\Phone",
                 wrk.ACCESS_READ);
        bInstalled = wrk.hasValue("SkypePath");
        wrk.close();
    }
    catch(e)
    {
    }
    return bInstalled
}

// TODO - this is a *monster* kludge to get some joystick input. refactor or use XPCOM component
function initJoys()
{
    if (!_proxy)
    {
        _proxy = server.serverProxy;
        _proxy.constructor(); // TODO sort this out - couldn't use declare as it used window
    }
    _proxy.addObserver(_id2, utils.bind(this, _onJoyButton));
    _proxy.send(_id2, '{"action" : "enablejoys", "channel":"2000"}');
}

var g_attachTimer;
var g_onAttachSuccess;

function init(onAttach, onFailAttach)
{
    if (!_checkInstalled())
    {
        if (onFailAttach) 
            onFailAttach();
        return;
    }

    if (!_proxy)
    {
        _proxy = server.serverProxy;
        _proxy.constructor(); // TODO sort this out - couldn't use declare as it used window
    }
    _proxy.addObserver(_id, utils.bind(this, _onResponse));
    _sendRequest('{"action": "launch"}');

    g_attachTimer = new ticker.Ticker(15000, function() {g_attachTimer.stop(); if (onFailAttach) onFailAttach(); });
    g_onAttachSuccess = onAttach;
    g_attachTimer.start();
}

function setCallStatusObserver(ob)
{
    _csobserver=ob;
}

function shutdown()
{
    if (!g_isAvailable)
        return;
        
    _proxy.removeObserver(_id);
    _proxy.send(_id, '{"action" : "shutdown"}');
    _proxy.shutdown();
    _proxy = null;
    g_isAvailable = false;
}

function call(who)
{
    if (!g_isAvailable)
        return;
        
    _sendRequest( { action: "call", who: who } );
}

function videoTest()
{
    if (!g_isAvailable)
        return;
        
    _sendRequest( { action: "videoTest"} );
}

function endCall()
{
    if (!g_isAvailable)
        return;
        
    _sendRequest( { action: "endcall"} );
}

function answerCall() 
{
    if (!g_isAvailable)
        return;
        
    _sendRequest( { action: "answercall"} );
}
 
function _sendRequest(what) {
    if (typeof what == 'object')
    {
        const json = utils.toJson(what);
        _proxy.send(_id, json);
    }
    else // assume string
    {
        _proxy.send(_id, what);
    }
}


function _onResponse(json) {
    var cmd = utils.fromJson(json);
    if (cmd.action == 'call-status')
    {
        if (_csobserver)
            _csobserver(cmd.status, cmd.partner);
    }
    else if (cmd.action == 'skype-status' && cmd.status == 'attach_success')
    {
        g_attachTimer.stop();
        g_isAvailable = true;
        if (g_onAttachSuccess)
            g_onAttachSuccess();
    }
    else if (cmd.action == 'skype-error')
    {
        utils.logit('Skype Error ' + cmd.command + ' ' + cmd.number + ' ' + cmd.description);
    }
}

function setJoyStatusObserver(ob)
{
    _jsobserver=ob;
}

function _onJoyButton(json) {
    var cmd = utils.fromJson(json);
    if (cmd.action == 'button-status')
    {
        if (_jsobserver)
            _jsobserver(cmd.status, cmd.joy, cmd.button);
    }
}
