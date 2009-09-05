var EXPORTED_SYMBOLS = ["getPageUrl", "getUserDataDir", "regetUserConfig", "parseURI",  "setCurrentUser", "getcontactDetails", "getUserConfig", "reloadUserConfig", "saveUserConfig", "getUserContacts", "toggleTheme", "togglePlayStartSound", "toggleSpeakTitles", "toggleSpeakLabels", "toggleShowLabels", "toggleShowImages", "toggleUseSkype", "toggleUserType", "toggleNSwitches", "toggleScanMode"];

//TODO clean up this file

var file = {};
Components.utils.import("resource://modules/file.js", file);
var path = {};
Components.utils.import("resource://modules/path.js", path);
var utils = {};
Components.utils.import("resource://modules/utils.js", utils);

// for now we do synchronous all at once access direct to object
// dojo data will give us a better api for the long term 

var g_user = 'Default';
var g_userConfig;//= {name: "Default", startsoundURI: null};

//TODO refactor out these app sepcific bits
function _setConfigDefaults()
{
    function _defaultSetting(obj, prop, value)
    {
        if (! (prop in obj))
            obj[prop] = value;
    }

    _defaultSetting(g_userConfig, "name", g_user);
    _defaultSetting(g_userConfig, "userType", 'scan');
    _defaultSetting(g_userConfig, 'startsoundURI', _getStartSoundURI());
    _defaultSetting(g_userConfig, 'theme', 'colour');
    _defaultSetting(g_userConfig, 'playStartSound', 'yes');
    _defaultSetting(g_userConfig, 'speakTitles', "yes");
    _defaultSetting(g_userConfig, 'showLabels', "yes");
    _defaultSetting(g_userConfig, 'showImages', "yes");
    _defaultSetting(g_userConfig, 'useSkype', "no");
    _defaultSetting(g_userConfig, 'splashTime', "4");
    _defaultSetting(g_userConfig, 'scanMode', "AUTO2SWITCH");
    _defaultSetting(g_userConfig, 'scanRate', "2500");
    _defaultSetting(g_userConfig, 'speakLabels', "yes");
    
    //userConfig.__defineGetter__("startsoundURI", _getStartSoundURI);
}

function toggleUserType()
{
    g_userConfig.userType = (g_userConfig.userType == 'touch') ? 'scan' : 'touch';
}

function toggleTheme()
{
    g_userConfig.theme = (g_userConfig.theme == 'colour') ? 'bw' : 'colour';
}

function toggleSpeakTitles()
{
    g_userConfig.speakTitles= (g_userConfig.speakTitles == 'yes') ? 'no' : 'yes';
}

function togglePlayStartSound()
{
    g_userConfig.playStartSound = (g_userConfig.playStartSound == 'yes') ? 'no' : 'yes';
}

function toggleSpeakLabels()
{
    g_userConfig.speakLabels= (g_userConfig.speakLabels == 'yes') ? 'no' : 'yes';
}

function toggleShowLabels()
{
    g_userConfig.showLabels= (g_userConfig.showLabels == 'yes') ? 'no' : 'yes';
}

function toggleShowImages()
{
    g_userConfig.showImages= (g_userConfig.showImages == 'yes') ? 'no' : 'yes';
}

function toggleUseSkype()
{
    g_userConfig.useSkype= (g_userConfig.useSkype == 'yes') ? 'no' : 'yes';
}

function toggleNSwitches()
{
    utils.logit(g_userConfig.scanMode);
    g_userConfig.scanMode = ( g_userConfig.scanMode == "USER1SWITCH" ) ? "USER2SWITCH" : 
                                            ( g_userConfig.scanMode == "AUTO1SWITCH" ) ? "AUTO2SWITCH" :
                                            ( g_userConfig.scanMode == "USER2SWITCH") ? "USER1SWITCH" :
                                                "USER1SWITCH" ; 
    utils.logit(g_userConfig.scanMode);
}

function toggleScanMode()
{
    utils.logit(g_userConfig.scanMode);
    g_userConfig.scanMode = ( g_userConfig.scanMode == "USER1SWITCH" ) ? "AUTO1SWITCH" : 
                                            ( g_userConfig.scanMode == "AUTO1SWITCH" ) ? "USER1SWITCH" :
                                            ( g_userConfig.scanMode == "USER2SWITCH") ? "AUTO2SWITCH" :
                                                "USER2SWITCH" ;
    utils.logit(g_userConfig.scanMode);
}

// TODO exception handling

function regetUserConfig()
{
    reloadUserConfig(); // so F5 rereads config file
    return getUserConfig();
}

function getPageUrl(page)
{
    return "chrome://maavis/content/" + page;
}

function _getMaavisDataDir()
{
    const dir = path.getUserDocsDir();
    dir.append('Maavis Media');
    return dir;
}

function getUserDataDir(user)
{ 
    var dir = _getMaavisDataDir();
    dir.append('Users');
    dir.append(g_user);
    return dir;
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

function _getUserConfigFile()
{
    const configFile = getUserDataDir();
    configFile.append("userconfig.json");
    return configFile;
}

function _readConfig(configFile)
{
    const strConfig = file.readFileToString(configFile);
    if ("" == strConfig)
        return {};
    const configObj =  utils.fromJson(strConfig); //TODO handle errors
    return configObj;
}

function _writeConfig(configObj, configFile)
{
    var strConfig = utils.toJson(configObj);
    if ("" == strConfig )
        return; // avoid erasing it if error
    strConfig  = strConfig.replace(/,"/gi, ',\n\r"'); // crude pretty print
    file.writeStringToFile(strConfig, configFile);
}

function getUserConfig()
{
    if (!g_userConfig)
    {
        g_userConfig = {};
        try
        {
            g_userConfig = _readConfig(_getUserConfigFile());
        }
        catch (ex)
        {
        }
        // set defaults 
        _setConfigDefaults();
    }
    return g_userConfig;
}

function saveUserConfig()
{
       try
        {
            _writeConfig(g_userConfig, _getUserConfigFile());
        }
        catch (ex)
        {
            return;
        }
 }

function reloadUserConfig()
{
    g_userConfig = undefined;
    getUserConfig();
}

function parseURI(str)
// translate keywords in URI  and convert \ to / 
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


/*
function getUserConfigFile()
{
    var f = _getMaavisDataDir();
    f.append("users.json");
    return f;
}

function getUsers()
{
    if (!g_allUserConfig)
    {
        const userConfigFile = getUserConfigFile();
        g_allUserConfig = _readConfig(userConfigFile).items;
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
*/

/*
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
*/
/*var g_appConfig = undefined;

function getAppConfigFile()
{
    var f = _getMaavisDataDir();
    f.append("config.json");
    return f;
}

function getAppConfig()
{
    if (!g_appConfig)
    {
        const appConfigFile = getAppConfigFile();
        g_appConfig = _readConfig(appConfigFile);
    }
    return g_appConfig;
}
*/

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

// EOF