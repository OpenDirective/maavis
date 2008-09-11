var EXPORTED_SYMBOLS = ["init", "shutdown", "isAvailable", "call", "endCall", "answerCall", "addCallStatusObserver"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
var server = {};
Components.utils.import("resource://modules/outfox.js", server);

var _proxy = null;
const _id = 0;
var _csobserver = null;
var _isAvailable = false;

function init()
{
    _proxy = server.serverProxy;
    _proxy.constructor(); // TODO sort this out - couldn't use declare as it used window
    _proxy.addObserver(_id, utils.bind(this, _onResponse));
    _sendRequest('{"action": "launch"}'); //TODO need a statemachine to track success/failure/shutdown
    _isAvailable = true;
}

function isAvailable()
{
    return _isAvailable;
}

function addCallStatusObserver(ob)
{
    _csobserver=ob;
}

function shutdown()
{
    _proxy.removeObserver(_id);
    _proxy.send(_id, '{"action" : "shutdown"}');
    _proxy.shutdown();
    _proxy = null;
    _isAvailable = false;
}

function call(who) {
    _sendRequest( { action: "call", who: who } );
}

function endCall() {
    _sendRequest( { action: "endcall"} );
}

function answerCall() {
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
            _csobserver(cmd.status);
    }
}
