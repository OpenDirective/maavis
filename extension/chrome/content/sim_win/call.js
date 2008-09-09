var skype = 
{
    proxy: null,
    id: 0,

    init: function()
    {
        this.proxy = new outfox.ServerProxy();
        this.proxy.addObserver(this.id, utils.bind(this, this._onResponse));
        this._sendRequest('{"action": "launch"}'); //TODO need a statemachine to track success/failure
    },

    shutdown: function()
    {
        this.proxy.removeObserver(this.id);
        this.proxy.send(this.id, '{"action" : "shutdown"}');
        this.proxy.shutdown();
    },

    _sendRequest: function(what) {
        if (typeof what == 'object')
        {
	        const json = utils.toJson(what);
	        this.proxy.send(this.id, json);
        }
        else // assume string
        {
    	    this.proxy.send(this.id, what);
        }
    },
    
    call: function(who) {
        this._sendRequest( { action: "call", who: who } );
     },

    _onResponse: function(json) {
    logit(json);
    }
};

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
           var btn = document.getElementById('btn');
    btn.setAttribute('oncommand', 'skype.call("stephenaleehome");' );

    skype.init();
}

function unloadPage()
{
    skype.shutdown();
}

window.addEventListener('load', loadPage, false);
window.addEventListener('unload', unloadPage, false);