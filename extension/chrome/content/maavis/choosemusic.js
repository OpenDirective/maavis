const path = {};
Components.utils.import("resource://modules/path.js", path);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    var row = 1;
    const pad = mainwindow.getElementById("pad");
    function addItemKey(itemUri)
    {
      try {
        const ios = Components.classes["@mozilla.org/network/io-service;1"]
                            .getService(Components.interfaces.nsIIOService);
        const URI = ios.newURI(itemUri, null, null);
        const file = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
        }
        catch(err)
        {
            return;
        }
        const itemName = file.leafName.slice(0, -4);

       var key = pad.createKey(row++, 0, 1, 4, itemName, null, "showPage|audioplayer.xul,"+ itemUri);
    }
    
    //   var contacts = config.getUserContacts();
    //contacts = [{name: "steve", photo: null, VOIP: "stephenaleehome"}];
    
    const folder = config.parseURI("file:///%User%Music/");
    const arTracks=[];
    path.expandURI(folder, arTracks);
    arTracks.forEach(addItemKey);
}

window.addEventListener('load', loadPage, false);
