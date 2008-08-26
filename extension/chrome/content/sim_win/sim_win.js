var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);
Components.utils.import("resource://modules/utils.js");

var app =
{
    mainwindow: mainwindow,
    
    showPage: function(page /*...*/)
    {
        const fpage = "chrome://sim_win/content/" + page;
        var args = Array();
        for (i=1; i < arguments.length; i++)
            args.push(arguments[i]); // copy to a real array
        this.mainwindow.setProps(args); // pass args to new window
        this.mainwindow.loadPage(fpage);
    },
    
    
    loadPage: function(window)
    {
        var action = {};
        Components.utils.import("resource://modules/action.js", action);
        var mt=this;

        action.setAction('goHome', function(){ this.mainwindow.goHome(); }, this);
        
        action.setAction('showPage', this.showPage, this);
        action.setAction('mediaPause', function(){ this.mainwindow.getElementById("player").togglePause()}, this);
        action.setAction('mediaRestart', function(){ this.mainwindow.getElementById("player").restart()}, this);
        action.setAction('mediaToggleMute', function(){ this.mainwindow.getElementById("player").toggleMute()}, this);
        action.setAction('mediaSetVolume', function(){ this.mainwindow.getElementById("player").setVolume()}, this);
        action.setAction('mediaLouder', function(){ this.mainwindow.getElementById("player").incVolume()}, this);
        action.setAction('mediaQuieter', function(){ this.mainwindow.getElementById("player").decVolume()}, this);
        action.setAction('mediaPrev', function(){ this.mainwindow.getElementById("player").prevItem()}, this);
        action.setAction('mediaNext', function(){ this.mainwindow.getElementById("player").nextItem()}, this);

        action.setAction('browseTo', function(page){ this.mainwindow.getElementById("browser").loadURI(page)}, this);
        action.setAction('browseBack', function(){ this.mainwindow.getElementById("browser").goBack()}, this);
        action.setAction('browseForward', function(){ this.mainwindow.getElementById("browser").goForward()}, this);
        action.setAction('browseReload', function(){ this.mainwindow.getElementById("browser").reload()}, this);

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
