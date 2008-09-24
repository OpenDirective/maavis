pref("security.fileuri.strict_origin_policy", false); //   required to stop errors in dojo data local file access

pref("app.update.enable", false);)
pref("browser.search.update", false);
pref("extensions.update.autoUpdateEnabled", false);
pref("extensions.update.enabled", false);

//pref("browser.fullscreen.animateUp", 0);
//pref("browser.fullscreen.autohide", false);

pref("browser.link.open_external", 1);
pref("browser.link.open_newwindow", 1);
pref("browser.link.open_newwindow.restriction", 0);

// remember to remove these for distribution
// can not use and if expression here
pref("javascript.options.showInConsole", true);
pref("nglayout.debug.disable_xul_cache", true); 
pref("browser.dom.window.dump.enabled", true); 
pref("javascript.options.strict", true); 
pref("extensions.logging.enabled", true);
