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

function enableAnswerCall(enable, text)
{
    enable = enable || false;
    const ac = document.getElementById("answerCall");
    if (ac)
    {
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
}

const page = 
{
    initPage: function()
    {
        window.removeEventListener('load', page.loadPage, false);

        var execute = {};
        Components.utils.import("resource://modules/execute.js", execute);
        
        enableAnswerCall(false);

        function fff(status, partner)
        { 
            if (status == "inprogress")
            {
                enableAnswerCall(false);
                execute.execSkype();
            }
            else if (status == "finished")
            {
                enableAnswerCall(false);
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
                    enableAnswerCall(true, partner);
                else
                {
                    skype.endCall();
                }
            }
        }
        skype.setCallStatusObserver(fff)

        mainwindow.setWindow(window);
        var users = config.getUsers();
        config.setCurrentUser(users[0]);
    }
};

window.addEventListener('load', page.initPage, false);
