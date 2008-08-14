const _defaultHomePage = 'chrome://example/content/example.xul'

function kioskDoNothing()
{
}

function kioskClose()
{
    close();
}

function kioskNavbarSetting()
{
    var kiosk_navbar_enable="true";
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    if (prefs.getPrefType("kiosk.navbar") == prefs.PREF_BOOL)
    {
        if (prefs.getBoolPref("kiosk.navbar")) kiosk_navbar_enable = "false";
    }
    var kiosk_element = document.getElementById("navigator-toolbox");
    kiosk_element.setAttribute("hidden", kiosk_navbar_enable);
}

function kioskBrowserStartup()
{
    kioskNavbarSetting();
    BrowserStartup();
}

function kioskStartup()
{
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
    getService(Components.interfaces.nsIPrefBranch);
    
    // options from command line
    var bNoKiosk = prefs.getBoolPref("sim_win.commandline.nokiosk");
    var strHomePage = prefs.getCharPref("sim_win.commandline.homepage");

    if (!bNoKiosk)
    {
        const strKioskOverlay = 'chrome://sim_win/content/kiosk/browserOverlay2.xul';
        window.addEventListener("load", function foo() {
                document.loadOverlay(strKioskOverlay, null);
            }, true);
    }

    window.addEventListener("load", function () {
                setTimeout(_delayedStartup, 500); // this allows all delayed starup to occur
        }, true);

    function _delayedStartup() // note can't use name delayedStartup as that always gets called
    {
        if (!bNoKiosk)
        {
            window.fullScreen = true;
        }

        const strPage = ((strHomePage == '') ? _defaultHomePage : strHomePage);
        loadURI(strPage);
    }
}
