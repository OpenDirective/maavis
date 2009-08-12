// every page needs to include this.

// These moduels become available for every page that includes this (i.e all pages)
// TODO think about putting all modules in Modules to reduce global namespace clutter.
const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const actions = {};
Components.utils.import("resource://modules/actions.js", actions);
const config = {};
Components.utils.import("resource://modules/config.js", config);
var skype = {};
Components.utils.import("resource://modules/skype.js", skype);

const CONFIRM_EXIT_PROMPT = "Confirm Bye Maavis";
const CONFIRM_EXIT_TIME = 3 * 1000;

function _loadConfig()
{
    config.reloadUserConfig(); // so F5 rereads config file
    return config.getUserConfig();
}

function nodeGen(nodelist)
// so we can iterate over HTML modelists
{
  for (var i = 0; i < nodelist.length; i++)
    yield nodelist[i];
};

const page = 
{
    
    config : _loadConfig(),

    _setColourStylesheet: function()
    {
        try 
        {
            const COLOUR_COLOUR = 0; // Is style sheet index - all pages must be same
            const COLOUR_BW = 1;        // Is style sheet index
            const toenable = (page.config.theme == 'colour') ? COLOUR_COLOUR : COLOUR_BW;
            const todisable = (toenable == COLOUR_COLOUR) ? COLOUR_BW : COLOUR_COLOUR;
            document.styleSheets[toenable].disabled=false;
            document.styleSheets[todisable].disabled=true;
        }
        catch(e)
        {
            utils.logit("Missing style sheet");
            throw (e);        
        }
    },

   onQuit: function()
    {
        function quit (aForceQuit)
        {
          var appStartup = Components.classes['@mozilla.org/toolkit/app-startup;1'].
            getService(Components.interfaces.nsIAppStartup);

          // eAttemptQuit will try to close each XUL window, but the XUL window can cancel the quit
          // process if there is unsaved data. eForceQuit will quit no matter what.
          var quitSeverity = aForceQuit ? Components.interfaces.nsIAppStartup.eForceQuit :
                                          Components.interfaces.nsIAppStartup.eAttemptQuit;
          appStartup.quit(quitSeverity);
        }

        const quitBtn = mainwindow.getWindow().document.getElementById("quit");
        if ("quitting" in quitBtn)
        {
            quit(false);
        }
        else
        {
            quitBtn.quitting = true;
            var label = quitBtn.label;
            function resetExit()
            {
                delete quitBtn.quitting;
                quitBtn.label = label;    
            }
            quitBtn.label = "Confirm "+ label;
            setTimeout(resetExit, CONFIRM_EXIT_TIME);
        }
    },
    
    initPage: function()
    {
        window.removeEventListener('load', page.initPage, false);

        mainwindow.setWindow(window);

        actions.setQuit(this.onQuit);
        
        page._setColourStylesheet();
        
        var execute = {};
        Components.utils.import("resource://modules/execute.js", execute);
        
        actions.showCall(false);
        const that = this;

        const pad = document.getElementsByTagName('touchpad')[0];
        if (pad !== undefined)
        {
            const message = pad.content.getElementsByClassName('message')[0];
            if (message !== undefined)
            {
                const speech = (page.config.speakTitles == "yes");
                message.setAttribute("speakOnLoad", (speech) ? "true" : "false");
            }
            const showLabels  = (page.config.showLabels == "yes");
            pad.setAttribute("showLabels", (showLabels) ? "true" : "false");
            const showImages = (page.config.showImages == "yes");
            pad.setAttribute("showImages", (showImages) ? "true" : "false");
            const speakLabels = (page.config.speakLabels == "yes");
            pad.setAttribute("showText", (speakLabels) ? "true" : "false");
            
            if (page.config.userType == 'scan')
            {
                function makeScankey(obj)
                {
                    obj.className += ' scankey';
                }
                
                for (var key in nodeGen(pad.content.getElementsByTagName('touchkey')))
                    makeScankey(key);
                for (var key in nodeGen(pad.content.getElementsByTagName('togglekey')))
                    makeScankey(key);
            }
        }
        
        if (!skype.isAvailable())
        {
            const answer = document.getElementsByClassName('answer')[0];
            if (answer !== undefined)
            {
                answer.collapsed = true;
            }
        }
        else
        {
            function onSkypeCallStatus(status, partner)
            { 
                if (status == "inprogress")
                {
                    actions.showCall(true);
                    execute.execSkype();
                }
                else if (status == "finished")
                {
                    actions.showCall(false);
                    execute.killSkype();
                }
                else if (status == "incoming")
                {
                    function isIn(element)
                    {
                        return (element.vid == partner);
                    }
                    var contact = config.getUserContacts().filter(isIn);
                    if (contact.length != 0)
                    {
                        actions.showCall(true, partner);
                        const player = document.getElementById("player");
                        if (player && player.isPlaying == 'true')
                        {
                           player.togglePause();
                        }
                    }
                    else
                    {
                        skype.endCall();
                    }
                }
            }
            skype.setCallStatusObserver(onSkypeCallStatus);

            window.addEventListener('unload', skype.endCall, false);
        }

        function onJoyButtonStatus(status, joys, button)
        {
            // we mis use a mutation event as can't create custom events with data.
            var event = document.createEvent("MutationEvents");
            const atype = ((status == 1) ? "joystickdown" : "joystickup");
            event.initMutationEvent(atype, true, true, null,
                                          '', // preValue
                                          '', // newValue
                                          joys.toString(), // attrName
                                          button); // attrChange

                window.dispatchEvent(event);
        }
        
        skype.setJoyStatusObserver(onJoyButtonStatus);
        window.addEventListener('joystickdown', page.scan, false);
        window.addEventListener('joystickup', page.scan, false);
        
        page.scan({'type':'joystickup', 'button':0});

//        var users = config.getUsers();
//        config.setCurrentUser(users[0]);
    },
    
    // TODO for some reason can't handle custom events in XBL so do here for now
    // tab key is done in XBL
    scan: function (event)
    {
        const down = (event.type == "joystickdown");
        const button = event.attrChange;
        const pad = document.getElementsByTagName('touchpad')[0];
        if (pad === undefined)
            return;
            
        //primitive 2 button scan.
        if (button == 0 && !down)
            pad.navigate(1, true);
        if (button == 1 && !down)
            pad.select();
    },
    
    addFolderKeys: function(container, folderURI, bDirs, alterItemCB)
    {    
        var nItem = 0;
        
        var image = null;
        function addItemKey(item, index)
        {
            try
            {
                const ios = Components.classes["@mozilla.org/network/io-service;1"]
                                    .getService(Components.interfaces.nsIIOService);
                const URI = ios.newURI(item.URI, null, null);
                const file = URI.QueryInterface(Components.interfaces.nsIFileURL).file;
            }
            catch(err)
            {
                throw (err);
                return;
            }
            const itemName = (bDirs) ? file.leafName : file.leafName.slice(0, -4);
           
            var cbItem = { URI: item.URI, name: itemName, 
									thumbURI: item.thumbURI, 
									action: (item.chooser) ? 'showPage|' + item.chooser + '.xul,' + item.URI : null };
			if (alterItemCB)
                alterItemCB(cbItem);
            if (page.config.userType == 'scan') // TODO temp so old screens still work
            {
                var key = container.addSelectionItem(cbItem.name, cbItem.thumbURI, 0.8, cbItem.action);
            }
            else
            {
                var key = container.createKey(row, col, 4, 3, cbItem.name, cbItem.thumbURI, 0.8, cbItem.action);
                var row, col;
                const nRows = 2, width = 3, height = 4;
                if (nItem < 4)
                {
                    row = (nItem < nRows) ? 1 : 1 + height;
                    col = (nItem % nRows) * width;
                }
                else
                {
                    row = 1 + height;
                    col = 2 * width;
                }
                nItem += 1;
                 }
            if (page.config.userType == 'scan')
            {
                key.className += ' scankey'
            }
        }
    
    const folder = config.parseURI(folderURI);
    const path = {};
    Components.utils.import("resource://modules/path.js", path);
    const type = (bDirs) ? path.expandTypes.EXP_DIRS : path.expandTypes.EXP_FILES;
    var arItems=[];
    path.expandURI(folder, arItems, type, 5);
    arItems.forEach(addItemKey);
    }
};

window.addEventListener('load', function(){page.initPage();}, false);

