
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
    //contacts = [{name: "steve", photo: null, VOIP: "stephenaleehome"}];
    //contacts.forEach(addContactPad);
}

window.addEventListener('load', loadPage, false);
