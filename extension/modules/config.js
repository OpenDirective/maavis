var EXPORTED_SYMBOLS = ["getPageUrl", "getUserDataDir", "getAppConfig", "parseURI", "getUsers", "setCurrentUser", "getcontactDetails", "getUserConfig", "getUserContacts", "getColour", "toggleColour", "getSpeech", "toggleSpeech"];

//TODO clean up this file

var file = {};
Components.utils.import("resource://modules/file.js", file);
var path = {};
Components.utils.import("resource://modules/path.js", path);
var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

// for now we do synchronous all at once access direct to object
// dojo data will give us a better api for the long term 

// TODO exception handling

function getPageUrl(page)
{
    return "chrome://maavis/content/" + page;
}

function readConfig(configFile)
{
    const strConfig = file.readFileToString(configFile);
    if ("" == strConfig)
        return {};
    const configObj =  utils.fromJson(strConfig);
    return configObj;
}

function writeConfig(configObj)
{
    const strConfig = utils.toJson(configObj);
    file.writeStringToFile(strConfig);
}

function getMaavisDataDir()
{
    const dir = path.getUserDocsDir();
    dir.append('Maavis Media');
    return dir;
}

function getUserDataDir(user)
{ //TODO - process user
    var dir = getMaavisDataDir();
    dir.append('Users');
    dir.append('Default');
    return dir;
}

function getAppConfigFile()
{
    var f = getMaavisDataDir();
    f.append("config.json");
    return f;
}

function getUserConfigFile()
{
    var f = getMaavisDataDir();
    f.append("users.json");
    return f;
}

var g_appConfig = undefined;

function getAppConfig()
{
    if (!g_appConfig)
    {
        const appConfigFile = getAppConfigFile();
        g_appConfig = readConfig(appConfigFile);
    }
    return g_appConfig;
}

var g_allUserConfig = undefined;
var g_currentUser = 'Default';
var g_currentUserConfig = {name: "Default", startsoundURI: null};

function getUsers()
{
    if (!g_allUserConfig)
    {
        const userConfigFile = getUserConfigFile();
        g_allUserConfig = readConfig(userConfigFile).items;
    }
    var users = g_allUserConfig.map(function(o){return o.name});
    return users;
}

function getUserDirFilenames(user, dirname)
{
    var dir = getUserDataDir(user);
    dir.append(dirname);
    const files = file.getDirFiles(dir);
    const filenames = files.map(function(f){return f.leafName;});
    return filenames;
}

function setCurrentUser(user)
{ 
    if (getUsers().indexOf(user) != -1 &&
        g_currentUser != user)
    {
        g_currentUser = user;
        g_currentUserConfig = g_allUserConfig.filter(function(e,i,a){return e.name == user})[0];
        g_currentUserConfig.videos = getUserDirFilenames(g_currentUser, "Videos");
        g_currentUserConfig.music = getUserDirFilenames(g_currentUser, "Music");
    }   
}

function _getStartSoundURI()
{
    var dir = getUserDataDir();
	var items = dir.directoryEntries;
    while (items.hasMoreElements())
    {
        var diritem = items.getNext().QueryInterface(Components.interfaces.nsIFile);
        var filename = diritem.leafName;
        if (diritem.isFile && filename.indexOf('startsound'.toLowerCase()) == 0)
        {
            return path.fileToURI(diritem);
        }
    }
	return null
}

function getUserConfig()
{
	g_currentUserConfig.startsoundURI = _getStartSoundURI();
    return g_currentUserConfig;
}

function parseURI(str)
{
    if (!str)
        return str;
            str = str.replace(/%User%/gi, getUserDataDir().path);
    if (str.slice(0, 5).toLowerCase() == 'file:')
        str = str.replace(/\\/gi, '/'); 
    return str;
}

function getContactDetails(str)
{
    contact = {};
    try
    {   
        const name = str.split('-');
        contact.name = utils.trim(name[0]);
        contact.vid = utils.trim(name[1]);
    }
    catch(e)
    {
    }
    return contact;
}

function getUserContacts()
{
    const contactsDir = getUserDataDir();
    contactsDir.append('Call');
    const contactsURI = path.fileToURI(contactsDir);
    var arItems=[];
    const b = path.expandURI(contactsURI, arItems, path.expandTypes.EXP_FILES, 5);
    var contacts = [];
    function addContact(item)
    {
            try
            {
                const ios = Components.classes["@mozilla.org/network/io-service;1"]
                                    .getService(Components.interfaces.nsIIOService);
                const URI = ios.newURI(item.URI, null, null);
                const file = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
            }
            catch(err)
            {
                throw (err);
                return;
            }
//TODO sort out thisduplications and toing an fro between nsiFile and path
        contacts.push(getContactDetails(file.leafName.slice(0, -4)));
    }
    arItems.forEach(addContact);
    return contacts;
}

/* no good as the cascade iscompletely messed up
var g_currentSheet = null;
function loadStylesheet(sheet)
{
    try
    {
        var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
                            .getService(Components.interfaces.nsIStyleSheetService);
        const type = sss.AGENT_SHEET;
        var ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        var uri = ios.newURI(sheet, null, null);
        if(g_currentSheet  && g_currentSheet != sheet)
        {
            sss.unregisterSheet(g_currentSheet, type);
        }
        sss.loadAndRegisterSheet(uri, type);
        g_currentSheet = uri;
    }
    catch (ex)
    {
        utils.logit('Error loading stylesheet'+ex);
    }
}
*/

function getColourFile()
{
    var fileColour = getUserDataDir();
    fileColour.append('.bw');
    return fileColour;
}

function getColour()
{
    const file = getColourFile();
    return (file.exists()) ? "bw" : "colour"; 
}

function toggleColour()
{
    try 
    {
        const file = getColourFile();
        if (file.exists())
            file.remove(false);
        else
            file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
    }
    catch(e)
    {
        utils.logit("Can't change colour");
        throw (e);        
    }
 }

function getSpeechFile()
{
    var fileNoSpeech = getUserDataDir();
    fileNoSpeech.append('.nospeech');
    return fileNoSpeech;
}

function getSpeech()
{
    const file = getSpeechFile();
    return (file.exists()) ? "nospeech" : "speech"; 
}

function toggleSpeech()
{
    try 
    {
        const file = getSpeechFile();
        if (file.exists())
            file.remove(false);
        else
            file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
    }
    catch(e)
    {
        utils.logit("Can't change speech");
        throw (e);        
    }
}

function getComplexity()
{
    const files = getComplexityFiles("full");
    return (areFileTimesTheSame(files.src, files.dst)) ? "full" : "reduced";
}

function areFileTimesTheSame(fileA, fileB)
{
   return fileA.lastModifiedTime == fileB.lastModifiedTime;
}

function getComplexityFiles(complexity)
{
    try 
    {
        const root = 'file:///' + path.getExtensionRootPath() + '\\chrome\\content\\';
        const src = 'maavis_' + g_complexity;
        const dst = 'maavis';
        // todo remove hard coding
        const ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        const srcURI = ios.newURI(root+src, null, null);
        const srcFile = srcURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        const dstURI = ios.newURI(root+dst, null, null);
        const dstFile = dstURI.QueryInterface(Components.interfaces.nsIFileURL).file;
        return {src: srcFile, dst: dstFile};
    }
    catch(e)
    {
        utils.logit("Can't get complexity files");
        throw(e);
        return {};        
    }
}


var g_complexity = 'full';
function toggleComplexity(g_complexity)
{
    g_complexity = (g_complexity == "reduced") ? "full" : 'reduced';

    try 
    {
        files = getComplexityFiles();
        files.dst.remove(true);
        files.src.copyTo(null, 'maavis');
    }
    catch(e)
    {
        utils.logit("Can't change complexity");
        throw (e);        
    }
}


// EOF