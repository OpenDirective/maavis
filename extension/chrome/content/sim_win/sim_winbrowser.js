// the first page to show
//const HOME_URL =  utils.fileToFileURL(utils.getInstalledPathForFile('ui', 'simwin.xhtml')); // relative to 'extension' directory
const HOME_URL =  'file://' + utils.getInstallationPath() + 'ui/simwin.xhtml';

function sim_win_donothing()
{
}

function sim_winclose()
{
    close();
}

function sim_win_navbar_setting()
{
    var sim_win_navbar_enable="true";
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    if (prefs.getPrefType("sim_win.navbar") == prefs.PREF_BOOL)
    {
        if (prefs.getBoolPref("sim_win.navbar")) sim_win_navbar_enable = "false";
    }
    var sim_win_element = document.getElementById("navigator-toolbox");
    sim_win_element.setAttribute("hidden", sim_win_navbar_enable);
}

function sim_winBrowserStartup()
{
    sim_win_navbar_setting();
    BrowserStartup();
    setTimeout(sim_winDelayedStartup, 1000);
}

function sim_winDelayedStartup()
{
    window.fullScreen = true;
    loadURI(HOME_URL);
}

DataTransferListener.handleData = function(data, target) {
   //alert("DataTransferListener.handleData: obtained " + data.name);
    utils.exec(data.what)
        //alert("DataTransferListener.handleData: returning changed data")
        //return {id:2000, name:"Pong"};
    return null;
}

/**
 * Acc. to web page (see above) the 4th parameter denotes if Events are accepted from
 * unsecure sources.
 */
document.addEventListener(DataTransferListener.ELWMS_EVENT_NAME, DataTransferListener.listenToHTML, false, true);
