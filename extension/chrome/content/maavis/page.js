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

const page = 
{
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
        window.removeEventListener('load', page.loadPage, false);

        mainwindow.setWindow(window);

        actions.setQuit(this.onQuit);
        
        var execute = {};
        Components.utils.import("resource://modules/execute.js", execute);
        
        actions.showCall(false);
        const that = this;

        const message = document.getElementsByClassName('message')[0];
        if (message !== undefined)
        {
            const speech = (actions.getSpeech() == "speech");
            message.setAttribute("speakOnLoad", (speech) ? "true" : "false");
        }
        
        if (skype.isAvailable())
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
            skype.setCallStatusObserver(onSkypeCallStatus)
        
            window.addEventListener('unload', skype.endCall, false);
        }
        
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
            
            var cbItem = { URI: item.URI, name: itemName, thumbURI: item.thumbURI, action: "" };
            if (alterItemCB)
                alterItemCB(cbItem);
            var key = container.createKey(row, col, 4, 3, cbItem.name, cbItem.thumbURI, 0.8, cbItem.action);
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