pref("security.fileuri.strict_origin_policy", false); //   required to stop errors in dojo data local file access

// debug options
const debug=true;
if (debug)
{
    pref("javascript.options.showInConsole", true); //Logs errors in chrome files to the Error Console.
    pref("nglayout.debug.disable_xul_cache", true); //Disables the XUL cache so that changes to windows and dialogs do not require a restart. This assumes you're using directories rather than JARs. Changes to XUL overlays will still require reloading of the document overlaid.
    pref("browser.dom.window.dump.enabled", true); //Enables the use of the dump() statement to print to the standard console. See window.dump for more info. You can also use nsIConsoleService from privileged script.
    pref("javascript.options.strict", true); //Enables strict JavaScript warnings in the Error Console. Note that since many people have this setting turned off when developing, you will see lots of warnings for problems with their code in addition to warnings for your own extension. You can filter those with Console2.
    pref("extensions.logging.enabled", true); //This will send more detailed information about installation and update problems to the Error Console. 
}