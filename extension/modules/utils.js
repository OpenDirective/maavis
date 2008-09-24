var EXPORTED_SYMBOLS = ["logit", "bind", "trim", "buildPath", "runProcess", "exec", "toJson", "fromJson", "isArray"];

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


function trim(str)
{
    return str.replace(/^\s*|\s*$/,"");
}

function bind(self, func, args)
{
	if(typeof args == 'undefined') 
    {
        var f = function(){
            func.apply(self, arguments);
        }
    } else
    {
        var f = function() {
            var args_inner = Array.prototype.slice.call(arguments);
            func.apply(self, args.concat(args_inner));
        }
    }
    return f;
}

/*
var ext_path: null,
 
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

function buildPath(root) {
    var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    if(root == null) {
        const simwinpath = {};
        Components.utils.import("resource://modules/path.js", simwinpath);
        root = simwinpath.getExtensionRootPath();
    }
    path.initWithPath(root);
    for(var i=1; i < arguments.length; i++) {
        path.append(arguments[i]);
    }
    return path;
}

function speak(what)
{
    var tts = Components.classes["@fullmeasure.co.uk/tts;1"].
        createInstance(Components.interfaces.ITTS);
    tts,speak(what);
    return pm;
}

/* access to nave JSON */
var _ijson = null;

function _getJSON()
{
    if(!_ijson)
    {
        _ijson = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
    }
    return _ijson;
}
    
function toJson(obj)
{
    return _getJSON().encode(obj);
}

function fromJson(text)
{
    return _getJSON().decode(text);
}


function isArray(obj)
{
    return obj.constructor.toString().indexOf("Array") != -1;
}

// EOF