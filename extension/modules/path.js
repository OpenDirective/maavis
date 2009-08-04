var EXPORTED_SYMBOLS = ["getFile", "getUserDocsDir", "fileToURI", "URIToFile", "ChromeURIToFileURI", "expandURI", "expandTypes", "getExtensionRootPath"];

const THUMBFILENAME = "Thumbnail";
const LINKFILENAME = "links.txt";
const CHOOSEFILEPREFIX = "_choose";

var utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const file = {};
Components.utils.import("resource://modules/file.js", file);

function getFile(path)
{
    var file = Components.classes["@mozilla.org/file/local;1"]
                         .createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(path);
    return file;
}

/*function getAppDataDir()
{
    // bit of a cludge but can't seem to use %appdata%
    const dirAppData = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties)
                         .get("AppRegD", Components.interfaces.nsIFile);
    var simwinAppDir = dirAppData.parent.parent;
    simwinAppDir.append("maavis");
    return simwinAppDir;
    }
*/

function getUserDocsDir()
{
    // bit of a cludge but can't seem to use %appdata%
    const dirUserDocs = Components.classes["@mozilla.org/file/directory_service;1"]
                         .getService(Components.interfaces.nsIProperties)
                         .get("Pers", Components.interfaces.nsIFile);
    return dirUserDocs;
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

function URIToFile(strURI)
{
    const ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);
    const URI = ios.newURI(strURI, null, null);
    const fileURI = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
    return fileURI;
}

function buildPath(root /*...*/)
{
    var path = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
    if(root == null) {
        root = getExtensionPath();
    }
    path.initWithPath(root);
    for(var i=1; i < arguments.length; i++) {
        path.append(arguments[i]);
    }
    return path;
}

const _EXTID = 'maavis@fullmeasure.co.uk';  //same as id in install.rdf

function getExtensionRootPath(id)
{
    id = id || _EXTID;
    var cls = Components.classes["@mozilla.org/extensions/manager;1"];
    var service = cls.getService(Components.interfaces.nsIExtensionManager);
    return service.getInstallLocation(id).getItemLocation(id).path;
}

function ChromeURIToFileURI(chrome)
// convert a chrome URI to absolute OS path file URI
{
    try
	{
		var uri = utils.getService("@mozilla.org/network/io-service;1", "nsIIOService")
					  .newURI(chrome, null, null);
		var reg = utils.getService("@mozilla.org/chrome/chrome-registry;1", "nsIChromeRegistry");
		return reg.convertChromeURL(uri).spec;
	} 
	catch (err) 
	{
		return '';
	}
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

function _getThumbnailFile( dir )
{
    var items = dir.directoryEntries;
    while (items.hasMoreElements())
    {
        var diritem = items.getNext().QueryInterface(Components.interfaces.nsIFile);
        if (diritem.isFile && diritem.leafName.slice(0,-4).toLowerCase() 
                                    == THUMBFILENAME.toLowerCase())
        {
            return diritem;
        }
    }
}

function _getChooser( dir )
{
   var items = dir.directoryEntries;
    while (items.hasMoreElements())
    {
        var diritem = items.getNext().QueryInterface(Components.interfaces.nsIFile);
        var filename = diritem.leafName;
        if (diritem.isFile && filename.indexOf(CHOOSEFILEPREFIX.toLowerCase()) == 0)
        {
            return filename.slice(1);
        }
    }
}

const expandTypes = { EXP_FILES: 0, EXP_DIRS: 1 };
function expandURI(strURI, arURIs, type, max )
{
    type = type || expandTypes.EXP_FILES;
    max = max || 0;
    
    try {
        const ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        const URI = ios.newURI(strURI, null, null);
        const fileURI = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
        }
    catch(err)
    {
        // not a file
        return false;
    }
    if (!fileURI.isDirectory())
    {
        return false;
    }

    function addFileURI(fileAdd)
    {
    
         if (!fileAdd.isReadable() || fileAdd.isSpecial() || fileAdd.isHidden()
                 || fileAdd.isExecutable() )
         {
            return;
         }
     
        if ((type == expandTypes.EXP_FILES) &&
                (!max || arURIs.length < max) && 
                fileAdd.isFile())
        {
            var itemz = {};
            if (fileAdd.leafName.toLowerCase() == LINKFILENAME.toLowerCase())
            {
                const URIs = file.readFileLines(fileAdd);
                function addURI(URI)
                {
                    itemz = { URI: URI, thumbURI: null, choose: null };
                    arURIs.push( itemz );
                }
                URIs.forEach(addURI);
            }
            else if (fileAdd.leafName.slice(0,-4).toLowerCase() == THUMBFILENAME.toLowerCase() ||
                        fileAdd.leafName.slice(0,-4).toLowerCase() == 'choose')
            {
                //skip
            }
            else
            {
                itemz = { URI: fileToURI(fileAdd), thumbURI: null, chooser: null };
                arURIs.push( itemz );
            }
        }
        else if ((type == expandTypes.EXP_DIRS) &&   
                    (!max || arURIs.length < (1 + max)) && 
                    fileAdd.isDirectory())
        {
            // look for thumb
            const thumbfile = _getThumbnailFile(fileAdd);
            const chooser = _getChooser(fileAdd);
            const item = { URI: fileToURI(fileAdd), 
                                    thumbURI: ((thumbfile) ? fileToURI(thumbfile) : null),
                                    chooser: chooser};
            arURIs.push( item );
        }
    }

    arURIs.length = 0;
    var files = file.getDirFiles(fileURI);
    files.forEach(addFileURI);
    
    return true;
}