var EXPORTED_SYMBOLS = ["logit", "runProcess", "exec", "getInstallationPath"];

const _EXTID = 'sim_win@fullmeasure.co.uk';  //same as id in install.rdf

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

function runProcess(path, args, block)
{
    var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
    process.init(path);
    process.run(block, args, args.length);
}

function exec(command)
{
    var pm = Components.classes["@senecac.on.ca/processmanager;1"].
        createInstance(Components.interfaces.IProcessManager);
    pm.start(command);
    return pm;
}

function buildPath(root)
{
    var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    if(root == null) {
        root = utils.getExtensionPath();
    }
    path.initWithPath(root);
    for(var i=1; i < arguments.length; i++) {
        path.append(arguments[i]);
    }
    return path;
}

function getExtensionPath(id)
{
    id = id || utils._EXTID;
    var cls = Components.classes["@mozilla.org/extensions/manager;1"];
    var service = cls.getService(Components.interfaces.nsIExtensionManager);
    return service.getInstallLocation(id).getItemLocation(id).path;
}

function getInstallationPath()
{
    // oh sodit lets assume / works in FF on Windows, its been there in windows since DOS and I won't be dealing with Drives
    var id = utils._EXTID;
    var cls = Components.classes["@mozilla.org/extensions/manager;1"];
    var service = cls.getService(Components.interfaces.nsIExtensionManager);
    var path = service.getInstallLocation(id).getItemLocation(id).parent.path;
    path = path.replace(/\\/g, '/');
    return path + '/';
}

/*    getInstalledPathForFile: function(filename ) // vaargs for path
    // for files outside extension
    {
        var cls = Components.classes["@mozilla.org/extensions/manager;1"];
        var service = cls.getService(Components.interfaces.nsIExtensionManager);
        var dir = service.getInstallLocation(_EXTID).getItemLocation(_EXTID);
        var file = dir.clone().parent;
        for (i=0; i< arguments.length; i++)
            file.append(arguments[i]); 
        return file.path;
    },

    fileToFileURL: function(file)
    {
        return "file://" + file.replace(/\\/g, '/');    // / is fine in URLs on windows as its supported / and \ for years now
    },
*/


/* access to nave JSON */
_ijson: null,

function _getJson()
{
    if(!_ijson) {
        _ijson = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
        return _ijson;
        }
}
    
function toJson(obj)
{
    return _getJson().ijson.encode(obj);
}

function fromJson(text)
{
    return _getJson().decode(text);
}

