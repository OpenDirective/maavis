/*
 * Copyright (c) 2008 Carolina Computer Assistive Technology
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 * */

if (!utils)
{
var utils = {
    _EXTID : 'sim_win@fullmeasure.co.uk',  //same as id in install.rdf

    logit : function () {
        var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                             .getService(Components.interfaces.nsIConsoleService);
        var text = '';
        for(var i=0; i < arguments.length; i++) {
        text += arguments[i] + ' ';
        }
        consoleService.logStringMessage(text);
    },

    _ijson: null,
	
    getJson: function() {
        if(!this._ijson) {
            this._ijson = Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON);
            return this._ijson;
			}
        },
    
    ext_path: null,
 
    bind: function(self, func, args) {
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

    runProcess: function(path, args, block) {
        var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
        process.init(path);
        process.run(block, args, args.length);
    },

	exec: function (command)
	{
	    var pm = Components.classes["@senecac.on.ca/processmanager;1"].
	    getService(Components.interfaces.IProcessManager);
	    pm.start(command);
	},

    buildPath: function(root) {
        var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
        if(root == null) {
            root = utils.getExtensionPath();
        }
        path.initWithPath(root);
        for(var i=1; i < arguments.length; i++) {
            path.append(arguments[i]);
        }
        return path;
    },

    getExtensionPath: function(id) {
        id = id || utils._EXTID;
        var cls = Components.classes["@mozilla.org/extensions/manager;1"];
        var service = cls.getService(Components.interfaces.nsIExtensionManager);
        return service.getInstallLocation(id).getItemLocation(id).path;
    },

    getInstallationPath: function() {
    // oh sodit lets assume / works in FF on Windows, its been there in windows since DOS and I won't be dealing with Drives
        id = utils._EXTID;
        var cls = Components.classes["@mozilla.org/extensions/manager;1"];
        var service = cls.getService(Components.interfaces.nsIExtensionManager);
        var path = service.getInstallLocation(id).getItemLocation(id).parent.path;
        path = path.replace(/\\/g, '/');
        return path + '/';
    },

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

    toJson: function(obj) {
        return this._getJson().ijson.encode(obj);
    },

    fromJson: function(text) {
        return this._getJson().decode(text);
    }
};
}