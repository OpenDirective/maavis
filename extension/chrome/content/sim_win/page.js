// every page needs to include this.

// These moduels become available for every page that includes this (i.e all pages)
// TODO think about putting all modules in Modules to reduce global namespace clutter.
const mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
const misc = {};
Components.utils.import("resource://modules/utils.js", misc);
const actions = {};
Components.utils.import("resource://modules/actions.js", actions);
const config = {};
Components.utils.import("resource://modules/config.js", config);

const page = 
{
    initPage: function()
    {
        window.removeEventListener('load', page.loadPage, false);
        
        mainwindow.setWindow(window);
        var users = config.getUsers();
        config.setCurrentUser(users[0]);
    }
};

window.addEventListener('load', page.initPage, false);
