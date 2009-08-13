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
const scan = {};
Components.utils.import("resource://modules/scan.js", scan);

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
        const quitBtn = mainwindow.getWindow().document.getElementById("quit");
        if ("quitting" in quitBtn)
        {
            mainwindow.quit(false);
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

        if (pad && page.config.userType == 'scan')
        {
            function foo()
            {
                scan.setSkipFunc(function(node) {return (node.disabled || (node.className.indexOf('scankey') == -1));});
                scan.setHighlightFunc(function(node) {node.focus();});
                scan.setSelectFunc(function(node) {node.click();});
                scan.startScan(pad.content.firstChild);
            }
            setTimeout(foo,1); // so all selection buttons get added

            function onJoyButtonStatus(status, joystick, button)
            {
                const direction = (status == 1) ? scan.EVENTS.BUTTONDOWN : scan.EVENTS.BUTTONUP;
                scan.onEvent(status, joystick, button);
            }
            skype.setJoyStatusObserver(onJoyButtonStatus);
        }

        window.addEventListener('keydown', 
                                            function(event)
                                            {
                                                if ((String.fromCharCode(event.which) == 'Q' 
                                                        || event.keyCode == 115/*ALT_F4*/) && event.altKey ) 
                                                {
                                                    mainwindow.quit();
                                                }
                                            }, false);
            
//        var users = config.getUsers();
//        config.setCurrentUser(users[0]);
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

