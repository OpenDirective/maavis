var EXPORTED_SYMBOLS = ["logit", "runProcess", "exec", "toJSON", "fromJSON", "isArray"];

function logit()
{
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                         .getService(Components.interfaces.nsIConsoleService);
    var text = '';
    for(var i=0; i < arguments.length; i++) {
    text += arguments[i] + ' ';
    }
    consoleService.logStringMessage(text);
}

/*
var ext_path: null,
 
function bind(self, func, args)
{
	if(typeof args == 'undefined') {
            var f = function() {
		func.apply(self, arguments);
            }
	} else {
            var f = function() {
		var args_inner = Array.prototype.slice.call(arguments);
		func.apply(self, args.concat(args_inner));
            }
	}
        return f;
    },

    classes: function(className) {
        return className.split(' ');
    },

    declare: function(name, base, sig) {
        var segs = name.split('.');
        var obj = window;
        for(var i=0; i < segs.length-1; i++) {
            var seg = segs[i];
            if(typeof obj[seg] == 'undefined') {
                obj[seg] = {};
            }
            obj = obj[seg];
        }
        var f = function() {
            this.constructor.apply(this, arguments);
        };
        if(base != null) {
            f.prototype = base;
        }
        for(var key in sig) {
            f.prototype[key] = sig[key];
        }
        obj[segs[segs.length-1]] = f;
    },
*/

function speak(what)
{
    var tts = Components.classes["@fullmeasure.co.uk/tts;1"].
        createInstance(Components.interfaces.ITTS);
    tts,speak(what);
    return pm;
}

/* access to nave JSON */
var _ijson = null;

function _getJson()
{
    if(!_ijson)
    {
        _ijson = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
    }
    return _ijson;
}
    
function toJSON(obj)
{
    return _getJson().ijson.encode(obj);
}

function fromJSON(text)
{
logit(text);
    return _getJson().decode(text);
}


function isArray(obj)
{
    return obj.constructor.toString().indexOf("Array") != -1;
}

// EOF