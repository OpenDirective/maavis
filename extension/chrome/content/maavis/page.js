// every page needs to include this.

// These moduels become available for every page that includes this (i.e all pages)
// TODO think about putting all modules in Modules to reduce global namespace clutter.
const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const utils = {};
Components.utils.import("resource://modules/utils.js", utils);
const actions = {};
Components.utils.import("resource://modules/actions.js", actions);

const file= {};
Components.utils.import("resource://modules/file.js", file);

const CONFIRM_EXIT_PROMPT = "Confirm Bye Maavis";
const CONFIRM_EXIT_TIME = 3 * 1000;

const _ns = 
// private namespace
{
    nodeGen: function(nodelist)
    // so we can iterate over HTML modelists
    {
      for (var i = 0; i < nodelist.length; i++)
        yield nodelist[i];
    },

    // module namespaces
    config: {},
    skype: {}
}
Components.utils.import("resource://modules/config.js", _ns.config);
Components.utils.import("resource://modules/skype.js", _ns.skype);

const page = 
{
    set config(u) {},
    get config() { return _ns.config.getUserConfig(); },

    set user(u) {_ns.config.setCurrentUser(u);},
    get user() {return page.config.name;},
    
    set login(b) {},
    get login() {return _ns.config.getCommandLineConfig().login;},

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
            if (page.login)
            {
                actions.showPage('login.xul');
            }
            else
            {
                mainwindow.quit(false);
            }
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
           
            if (page.config.userType == 'scan')
            {
                function makeScankey(obj)
                {
                    obj.className += ' scankey';
                }
                for (var key in _ns.nodeGen(pad.content.getElementsByTagName('touchkey')))
                    makeScankey(key);
                for (var key in _ns.nodeGen(pad.content.getElementsByTagName('togglekey')))
                    makeScankey(key);
            }
        }
        
        if (!_ns.skype.isAvailable())
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
                        _ns.skype.endCall();
                    }
                }
            }
            _ns.skype.setCallStatusObserver(onSkypeCallStatus);

            window.addEventListener('unload', _ns.skype.endCall, false);
        }

        if (pad && page.config.userType == 'scan')
        {
            page._setGridSize(pad);
            
            function startScanning()
            {
                const scan = {};
                Components.utils.import("resource://modules/scan.js", scan);
                
                scan.setSkipFunc(function(node) {return (node.id=='avatar'||node.hidden || node.disabled || (node.className.indexOf('scankey') == -1));});
                function highlightItem(node)
                {
                    node.focus();
                    const speakLabels = (page.config.speakLabels == "yes" && 
                                                    !(page._isPasswordPage && page.config.passwordItems == 'images')); // TODO fragile 
                    if (speakLabels)
                    {
                        setTimeout(function() {setTimeout(function(){node.playPrompt( scan.resumeScan );}, 1)}, 1); // need this to make screen refresh
                    }
                   return speakLabels; // pause scanning until scan.resume called to simulate sync calls
                }
                scan.setHighlightFunc(highlightItem);
                scan.setSelectFunc(function(node) {node.click();});
                setTimeout(function(){scan.startScan(page.config.scanMode, page.config.scanRate, pad.content.firstChild);}, 900); // a little delay for spoken title
            }
            setTimeout(startScanning,1); // so all selection buttons get added
        }

        // Quit handling
        window.addEventListener('keydown', 
                                            function(event)
                                            {
                                                if ((String.fromCharCode(event.which) == 'Q' 
                                                        || event.keyCode == 115/*ALT_F4*/) && event.altKey ) 
                                                {
                                                    mainwindow.quit();
                                                }
                                                else if (event.keyCode == 116/*F5*/)
                                                {
                                                    page.user=page.user; // so F5 rereads use config file
                                                }
                                            }, false);

    },

    addFolderKeys: function(container, folderURI, bDirs, alterItemCB, re)
    {    
        var nItem = 0;

        function getPromptFile(folder, baseName)
        {
            // look for a prompt file of form <item>_prompt{.*}
            const re = new RegExp ('^'+baseName+'_prompt.*$', "i");
            const promptFiles = file.getDirFiles(folder, re);
            return (promptFiles.length) ? path.fileToURI(promptFiles[0]) : null;
        }
                
        var image = null;
        function addItemKey(item)
        {
            try
            {
                const fileItem = path.URIToFile(item.URI);
            }
            catch(err)
            {
                throw (err);
                return;
            }
            //TODO remove assumption is local file URI
            const itemName = (bDirs) ? fileItem.leafName : fileItem.leafName.slice(0, -4);
           
            const chooser = (folderConfig) ? folderConfig['type'] : item.chooser;
            const arg = (folderConfig && folderConfig.actions[itemName]) ? folderConfig.actions[itemName] : item.URI;
            const action = (chooser)  ? 'showPage|' + chooser + '.xul,' + arg : null;
            var cbItem = { "URI": item.URI, 
                                    "name": itemName, 
									"thumbURI": item.thumbURI, 
									"action": action ,
                                    "arg": arg};
			if (alterItemCB)
                alterItemCB(cbItem);
            if (page.config.userType == 'scan') // TODO temp so old screens still work
            {
                const prompt  = getPromptFile(fileItem.parent, itemName);
                var key = container.addSelectionsItem(cbItem.name, cbItem.thumbURI, 0.8, cbItem.action,'', prompt);
                if (key)
                {
                    key.className += ' scankey';
                }
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
        }
    
        const folder = _ns.config.parseURI(folderURI);
        const path = {};
        Components.utils.import("resource://modules/path.js", path);
        const type = (bDirs) ? path.expandTypes.EXP_DIRS : path.expandTypes.EXP_FILES;
            
        var curpage = parseInt(mainwindow.getProp(actions.SELECTIONS_PAGE_PROP));
        curpage = (!curpage || isNaN(curpage)) ? 0 : curpage; 
        container.setSelectionsPage(curpage);
        const scanKey = container.addSelectionsItem('More Items...', null, 1, 'nextSelectionsPage', null, null, true); // add the more item
        scanKey.className += ' scankey';

        var folderConfig = page.readFolderConfig(folder);
            
        var arItems=[]; 
        path.expandURI(folder, arItems, type, re);
        arItems.forEach(addItemKey);
        container.endSelectionsAdd();
    },
    
    readFolderConfig: function(folderURI)
    {
        const file = {};
        Components.utils.import("resource://modules/file.js", file);
        const path = {};
        Components.utils.import("resource://modules/path.js", path);

        try
        {
            const folder = path.URIToFile(folderURI);
            folder.append('chooserconfig.txt');
            const arrLines = file.readFileLines(folder);
            const type = arrLines.shift().split('=')[1]; // TODO very fragile
            var config = {'type':type, actions:{}};
            arrLines.forEach(function(el, i, ar) {var p = el.split('='); config.actions[p[0]] = p[1];})
            return config;
        }
        catch (e)
        {
            //utils.logit(e);
            return null;
        }
    },
    
    get _pageName () { return window.location.pathname.split('/')[2]; },// TODO Fragile,
    get _isPasswordPage () { return page._pageName  == "password-scan.xul"; },
        
    _setGridSize: function(pad)
    {
        const size = ((page._isPasswordPage) ? page.config.passwordSetSize : page.config.selectionsSetSize).split('x');
        const cols = (isNaN(size[0])) ? '3' : size[0];
        const rows = (isNaN(size[1])) ? '3' : size[1];
        pad.setSelectionsGrid(cols, rows);
    }
    
};

window.addEventListener('load', function(){page.initPage();}, false);

