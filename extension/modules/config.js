var EXPORTED_SYMBOLS = ["getPageUrl", "getAppConfig", "parseURI", "getUsers", "setCurrentUser", "getUserConfig", "getUserContacts"];

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
    return "chrome://sim_win/content/" + page;
}

function readConfig(configFile)
{
    const strConfig = file.readFileToString(configFile);
    if ("" == strConfig)
        return {};
    const configObj =  utils.fromJSON(strConfig);
    return configObj;
}

function writeConfig(configObj)
{
    const strConfig = utils.toJSON(configObj);
    file.writeStringToFile(strConfig);
}

function getConfigRoot()
{
}

function getAppConfigFile()
{
    const f = path.getAppDataDir();
    f.append("config.json");
    return f;
}

function getUserDataPath()
{
    return getUserDataDir(g_currentUser).path +  "\\";
}

function getUserDataDir(user)
{
    const dir = path.getAppDataDir();
    dir.append('Users');
    dir.append(user);
    return dir;
}

function getUserConfigFile()
{
    const f = path.getAppDataDir();
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
var g_currentUser = 'Guest';
var g_currentUserConfig = {name: "Guest"};

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

function getUserConfig()
{
    return g_currentUserConfig;
}

function parseURI(str)
{
    if (!str)
        return str;
        
    str = str.replace(/%User%/gi, getUserDataPath());
    if (str.slice(0, 5).toLowerCase() == 'file:')
        str = str.replace(/\\/gi, '/'); 
    return str;
}

function getUserContacts()
{
    return [{vid: "stephenaleehome"}];
    return g_currentUserConfig.contacts;
}

