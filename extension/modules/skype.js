var EXPORTED_SYMBOLS = ["init", "shutdown", "isAvailable", "call", "endCall", "answerCall", "setCallStatusObserver"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
var server = {};
Components.utils.import("resource://modules/outfox.js", server);

var _proxy = null;
const _id = 0;
var _csobserver = null;
var _isAvailable = false;


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

function init()
{
    if (!_checkInstalled())
        return;
        
    _proxy = server.serverProxy;
    _proxy.constructor(); // TODO sort this out - couldn't use declare as it used window
    _proxy.addObserver(_id, utils.bind(this, _onResponse));
    _sendRequest('{"action": "launch"}');
    //TODO need a statemachine to track success/failure/shutdown
    _isAvailable = true;
}

function isAvailable()
{
    return _isAvailable;
}

function setCallStatusObserver(ob)
{
    _csobserver=ob;
}

function shutdown()
{
    if (!_isAvailable)
        return;
        
    _proxy.removeObserver(_id);
    _proxy.send(_id, '{"action" : "shutdown"}');
    _proxy.shutdown();
    _proxy = null;
    _isAvailable = false;
}

function call(who)
{
    if (!_isAvailable)
        return;
        
    _sendRequest( { action: "call", who: who } );
}

function endCall()
{
    if (!_isAvailable)
        return;
        
    _sendRequest( { action: "endcall"} );
}

function answerCall() 
{
    if (!_isAvailable)
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
}
