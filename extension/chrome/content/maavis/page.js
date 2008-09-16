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

const page = 
{
    _enableAnswerCall: function (enable, text)
    {
        enable = enable || false;
        var ac = document.getElementsByClassName("answer");
        if (ac.length && ac[0])
        {
            ac = ac[0];
            ac.setAttribute("disabled", enable ? "false" : "true");
            if (enable)
            {
                ac.oldLabel = ac.label;
                ac.label += "\n" + text;
            }
            else if (!enable && ac.oldLabel)
            {
                ac.label = ac.oldLabel;
            }
        }
    },

    initPage: function()
    {
        window.removeEventListener('load', page.loadPage, false);

        var execute = {};
        Components.utils.import("resource://modules/execute.js", execute);
        
        this._enableAnswerCall(false);
        const that = this;
        
        if (skype.isAvailable())
        {
            function onSkypeCallStatus(status, partner)
            { 
                if (status == "inprogress")
                {
                    that._enableAnswerCall(false);
                    execute.execSkype();
                }
                else if (status == "finished")
                {
                    that._enableAnswerCall(false);
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
                        that._enableAnswerCall(true, partner);
                        const player = document.getElementById("player");
                        if (player && player.isPlaying() == 'true')
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
        
        mainwindow.setWindow(window);
        var users = config.getUsers();
        config.setCurrentUser(users[0]);
    }
};

window.addEventListener('load', function(){page.initPage();}, false);
