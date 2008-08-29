//var mainwindow = {};
//Components.utils.import("resource://modules/mainwindow.js", mainwindow);



function loadPage()
{
    window.removeEventListener('load', loadPage, false);
}

window.addEventListener('load', loadPage, false);


Components.utils.import("resource://modules/utils.js");
var config = {};
Components.utils.import("resource://modules/config.js", config);

var users = config.getUsers();
config.setCurrentUser(users[0]);