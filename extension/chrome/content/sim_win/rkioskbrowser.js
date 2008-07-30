function Rkiosk_donothing()
{


}

function rkioskclose()
{
  close();
}

function Rkiosk_navbar_setting()
{
  var rkiosk_navbar_enable="true";
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].
  	getService(Components.interfaces.nsIPrefBranch);
  if (prefs.getPrefType("rkiosk.navbar") == prefs.PREF_BOOL){
    if (prefs.getBoolPref("rkiosk.navbar")) rkiosk_navbar_enable = "false";
  }
  var rkiosk_element = document.getElementById("navigator-toolbox");
  rkiosk_element.setAttribute("hidden", rkiosk_navbar_enable);
}

function RkioskBrowserStartup()
{
  Rkiosk_navbar_setting();
  BrowserStartup();
  loadURI("file:///H:/SIM_WIN/extension/simwin.xhtml");
  setTimeout(RkioskdelayedStartup, 1000);
}

function RkioskdelayedStartup()
{
  window.fullScreen = true;
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
