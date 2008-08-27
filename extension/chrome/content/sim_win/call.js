var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
var config = {};
Components.utils.import("resource://modules/config.js", config);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    var row = 1;
    function addContactPad(contact)
    {
       const pad = mainwindow.getElementById("pad");
       var key = pad.createKey(row++, 0, 1, 2, contact.name, config.parseURI(contact.photo), "voipCall|"+ contact.VOIP);
     }
    
    var contacts = config.getUserContacts();
    contacts.forEach(addContactPad);
}

window.addEventListener('load', loadPage, false);