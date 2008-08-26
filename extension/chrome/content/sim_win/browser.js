var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);

var config;

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
}

window.addEventListener('load', loadPage, false);

