const defaultHomePage = 'file://' + utils.getInstallationPath() + 'ui/simwin.xhtml'

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
}

function sim_winFinalStartup()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    
    // options from command line
    var bNoKiosk = prefs.getBoolPref("sim_win.commandline.nokiosk");
    var bNoFullScreen = prefs.getBoolPref("sim_win.commandline.nofullscreen");
    var strHomePage = prefs.getCharPref("sim_win.commandline.homepage");

    if (!bNoKiosk)
    {
        const strKioskOverlay = 'chrome://sim_win/content/sim_winbrowser.xul';
        window.addEventListener("load", function foo() {
                document.loadOverlay(strKioskOverlay, null);
            }, true);
    }

    window.addEventListener("load", function () {
                setTimeout(_delayedStartup, 500); // this allows all delayed starup to occur
        }, true);

    function _delayedStartup() // note can't use name delayedStartup as that always gets called
    {
        if (!bNoFullScreen)
        {
            window.fullScreen = true;
        }

        const strPage = (strHomePage == '') ? defaultHomePage : strHomePage;
        loadURI(strPage);
    }
}
