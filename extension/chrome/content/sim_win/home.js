var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);

var config;

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
}

window.addEventListener('load', loadPage, false);


Components.utils.import("resource://modules/utils.js");
var config = {};
Components.utils.import("resource://modules/config.js", config);

var users = config.getUsers();
logit(users[0]);
config.setCurrentUser(users[0]);
var conf = config.getCurrentUserConfig();
logit(conf.name + ' ' + conf.news[0]);
