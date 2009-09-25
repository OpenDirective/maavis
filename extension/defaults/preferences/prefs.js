pref("security.fileuri.strict_origin_policy", false); //   required to stop errors in dojo data local file access

// Disable updates
pref("app.update.enabled", false);)
pref("browser.search.update", false);
pref("extensions.update.autoUpdateEnabled", false);
pref("extensions.update.enabled", false);

// Blank homepage - sometime shows early on
pref("browser.startup.page", 0);

//pref("browser.fullscreen.animateUp", 0);
//pref("browser.fullscreen.autohide", false);

pref("browser.link.open_external", 1);
pref("browser.link.open_newwindow", 1);
pref("browser.link.open_newwindow.restriction", 0);

// attempt auto proxy detection
pref("network.proxy.type", 4);    