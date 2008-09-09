var EXPORTED_SYMBOLS = ["getFile", "getAppDataDir", "fileToURI", "expandURI", "getExtensionRootPath"];

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

function getFile(path)
{
    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(path);
    return file;
}

function getAppDataDir()
{
    // bit of a cludge but can't seem to use %appdata%
    const dirAppData = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties)
                         .get("AppRegD", Components.interfaces.nsIFile);
    var simwinAppDir = dirAppData.parent.parent;
    simwinAppDir.append("SIM_WIN");
    return simwinAppDir;
    }

function fileToURI(file)
{
    if ( typeof file == "string" )
        file = getFile(file);

    const ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);
    const URL = ios.newFileURI(file);
    
    return URL.spec;
}

function buildPath(root)
{
    var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    if(root == null) {
        root = utils._getExtensionPath();
    }
    path.initWithPath(root);
    for(var i=1; i < arguments.length; i++) {
        path.append(arguments[i]);
    }
    return path;
}

const _EXTID = 'sim_win@fullmeasure.co.uk';  //same as id in install.rdf

function getExtensionRootPath(id)
{
    id = id || _EXTID;
    var cls = Components.classes["@mozilla.org/extensions/manager;1"];
    var service = cls.getService(Components.interfaces.nsIExtensionManager);
    return service.getInstallLocation(id).getItemLocation(id).path;
}

function getInstallationPath()
{
    // oh sodit lets assume / works in FF on Windows, its been there in windows since DOS and I won't be dealing with Drives
    var id = _EXTID;
    var cls = Components.classes["@mozilla.org/extensions/manager;1"];
    var service = cls.getService(Components.interfaces.nsIExtensionManager);
    var path = service.getInstallLocation(id).getItemLocation(id).parent.path;
    path = path.replace(/\\/g, '/');
    return path + '/';
}

function expandURI(strURI, arURIs)
{
    const ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);
    const URI = ios.newURI(strURI, null, null);
    const fileURI = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
              
    if (!fileURI.isDirectory())
    {
        return false;
    }

    const file = {};
    Components.utils.import("resource://modules/file.js", file);
    var files = file.getDirFiles(fileURI);
    
    arURIs.length = 0;
    function addFileURI(file)
    { 
        arURIs.push(fileToURI(file));
    }
    files.forEach(addFileURI);
    
    return true;
}