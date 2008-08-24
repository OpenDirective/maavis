var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
Components.utils.import("resource://modules/utils.js");

var app =
{
    mainwindow: mainwindow,
    
    showVideo: function(mrl, options)
    {
        this.mainwindow.setProps({mrl: mrl, options: options});
        this.mainwindow.setPage("chrome://sim_win/content/videoplayer.xul");
    },

    loadPage: function(window)
    {
        var action = {};
        Components.utils.import("resource://modules/action.js", action);
        var mt=this;
        action.setAction('video', this.showVideo, this);

        mainwindow.goHome.apply(mainwindow);
    },

    initWindow: function()
    {
        window.removeEventListener('load', app.initWindow, false);
        mainwindow.setHome("chrome://sim_win/content/home.xul");
        mainwindow.showWindow(window, function(){app.loadPage();});
    }
};

window.addEventListener('load', app.initWindow, false);
