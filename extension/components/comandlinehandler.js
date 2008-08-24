const nsIAppShellService    = Components.interfaces.nsIAppShellService;
const nsISupports           = Components.interfaces.nsISupports;
const nsICategoryManager    = Components.interfaces.nsICategoryManager;
const nsIComponentRegistrar = Components.interfaces.nsIComponentRegistrar;
const nsICommandLine        = Components.interfaces.nsICommandLine;
const nsICommandLineHandler = Components.interfaces.nsICommandLineHandler;
const nsIFactory            = Components.interfaces.nsIFactory;
const nsIModule             = Components.interfaces.nsIModule;
const nsIWindowWatcher      = Components.interfaces.nsIWindowWatcher;

const CHROME_URI = "chrome://sim_win/content/sim_win.xul"; 

const clh_contractID = "@mozilla.org/commandlinehandler/general-startup;1?type=sim_win";

const clh_CID = Components.ID("{412d63b0-639a-11dd-ad8b-0800200c9a66}");

// category names are sorted alphabetically. Typical command-line handlers use a
// category that begins with the letter "m".
const clh_category = "m-sim_win";

/**
 * Utility functions
 */

/**
 * Opens a chrome window.
 * @param aChromeURISpec a string specifying the URI of the window to open.
 * @param aArgument an argument to pass to the window (may be null)
 */
function openWindow(aChromeURISpec, aArgument, bKiosked)
{
    // TODO seems we always get a chrome window whatever is specified here
    // would like to have status bar so cn get at firebug in debug
    const strFeatures = (bKiosked) ? "centerscreen,titlebar=no,dialog=no" : 
                        "centerscreen,menubar,toolbar,status=yes,resizable,dialog=no";
                        
    var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].
                getService(nsIWindowWatcher);

    const params = Components.classes["@mozilla.org/embedcomp/dialogparam;1"]
                              .createInstance(Components.interfaces.nsIDialogParamBlock);
    params.SetInt(0, bKiosked);
  
    ww.openWindow(null, aChromeURISpec, "sim_win",
                    strFeatures,
                    params );
}
 
/**
 * The XPCOM component that implements nsICommandLineHandler.
 * It also implements nsIFactory to serve as its own singleton factory.
 */
const myAppHandler = {
  /* nsISupports */
  QueryInterface : function clh_QI(iid)
  {
    if (iid.equals(nsICommandLineHandler) ||
        iid.equals(nsIFactory) ||
        iid.equals(nsISupports))
      return this;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  /* nsICommandLineHandler */

  handle : function clh_handle(cmdLine)
  {
   // we use pref to communicate with the startup XUL - bit of a hack
    var prefs = Components.classes["@mozilla.org/preferences-service;1"].
                getService(Components.interfaces.nsIPrefBranch);
    var uristr = '';
    
    var bNoKiosk = cmdLine.handleFlag("nokiosk", false);
    prefs.setBoolPref("sim_win.commandline.nokiosk", bNoKiosk);

    try {
      uristr = cmdLine.handleFlagWithParam("xulpage", false);
      if (uristr) {
        // convert uristr to an nsIURI
        var uri = cmdLine.resolveURI(uristr);
        openWindow(CHROME_URI, uri, !bNoKiosk);
        cmdLine.preventDefault = true;
      }
    }
    catch (e) {
      Components.utils.reportError("incorrect parameter passed to -xulpage on the command line.");
    }

    try {
        // TODO: handle -url and -chrome instead
      uristr = cmdLine.handleFlagWithParam("homepage", false);
      uristr = (uristr) ? uristr : '';
      prefs.setCharPref("sim_win.commandline.homepage", uristr);
    }
    catch (e) {
      Components.utils.reportError("incorrect parameter passed to -homepage on the command line.");
    }
    
    // default is to open sim win in a chrome window
    if (!uristr)
    {
        openWindow(CHROME_URI, null, !bNoKiosk);
        cmdLine.preventDefault = true;
    }
    
  },

  // CHANGEME: change the help info as appropriate, but
  // follow the guidelines in nsICommandLineHandler.idl
  // specifically, flag descriptions should start at
  // character 24, and lines should be wrapped at
  // 72 characters with embedded newlines,
  // and finally, the string should end with a newline
  helpInfo : "  -xulpage <uri>       XUL page to open in chrome window\n" +
                "  -homepage <uri>   Home page to show in the browser\n"+
                "  -nokiosk          Don't use kiosk mode\n",

  /* nsIFactory */

  createInstance : function clh_CI(outer, iid)
  {
    if (outer != null)
      throw Components.results.NS_ERROR_NO_AGGREGATION;

    return this.QueryInterface(iid);
  },

  lockFactory : function clh_lock(lock)
  {
    /* no-op */
  }
};

/**
 * The XPCOM glue that implements nsIModule
 */
const myAppHandlerModule = {
  /* nsISupports */
  QueryInterface : function mod_QI(iid)
  {
    if (iid.equals(nsIModule) ||
        iid.equals(nsISupports))
      return this;

    throw Components.results.NS_ERROR_NO_INTERFACE;
  },

  /* nsIModule */
  getClassObject : function mod_gch(compMgr, cid, iid)
  {
    if (cid.equals(clh_CID))
      return myAppHandler.QueryInterface(iid);

    throw Components.results.NS_ERROR_NOT_REGISTERED;
  },

  registerSelf : function mod_regself(compMgr, fileSpec, location, type)
  {
    compMgr.QueryInterface(nsIComponentRegistrar);

    compMgr.registerFactoryLocation(clh_CID,
                                    "myAppHandler",
                                    clh_contractID,
                                    fileSpec,
                                    location,
                                    type);

    var catMan = Components.classes["@mozilla.org/categorymanager;1"].
      getService(nsICategoryManager);
    catMan.addCategoryEntry("command-line-handler",
                            clh_category,
                            clh_contractID, true, true);
  },

  unregisterSelf : function mod_unreg(compMgr, location, type)
  {
    compMgr.QueryInterface(nsIComponentRegistrar);
    compMgr.unregisterFactoryLocation(clh_CID, location);

    var catMan = Components.classes["@mozilla.org/categorymanager;1"].
      getService(nsICategoryManager);
    catMan.deleteCategoryEntry("command-line-handler", clh_category);
  },

  canUnload : function (compMgr)
  {
    return true;
  }
};

/* The NSGetModule function is the magic entry point that XPCOM uses to find what XPCOM objects
 * this component provides
 */
function NSGetModule(comMgr, fileSpec)
{
  return myAppHandlerModule;
}