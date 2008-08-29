var modules = {};
modules.mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", modules.mainwindow);
modules.utils = {};
Components.utils.import("resource://modules/utils.js", modules.utils);
modules.config = {};
Components.utils.import("resource://modules/config.js", modules.config);
modules.path = {};
Components.utils.import("resource://modules/path.js", modules.path);
modules.file = {};
Components.utils.import("resource://modules/file.js", modules.file);
modules.action = {}
Components.utils.import("resource://modules/action.js", modules.action);


var app =
{
    modules: modules,
    mainwindow: modules.mainwindow,
    
    showPage: function(page /*...*/)
    {
        const fpage = "chrome://sim_win/content/" + page;
        
        args = [];
        for (i=1; i < arguments.length; i++)
        {
            var str = this.modules.config.parseURI(arguments[i])
            ar=[];
            if (this.modules.path.expandURI(str, ar))
            {
                args.push(ar);
            }
            else
            {
                args.push(str);         // copy to a real array
            }
        }
        this.mainwindow.setProps(args); // pass args to new window
        this.mainwindow.loadPage(fpage);
    },

    voipCall: function(vid /*...*/)
    {
        this.mainwindow.alert("called: " + vid);
        this.modules.file.launchFile("C:\\boot.ini");
    },

        pollProc: function()
        {
//mt.modules.utils.exec(prog);
this.modules.utils.logit('tick');
/*            if( !proc.isRunning())
            {
                mt.modules.utils.logit('dead');
                window.clearInterval(poller);
            }*/
        },

    kill: function(prog)
    {
        this.proc.stop();
        const window = this.mainwindow.getWindow();
        window.minimize();
    },
    
    exec: function(prog)
    {
        const window = this.mainwindow.getWindow();
        this.proc = this.modules.utils.exec(prog);
        var pollerid = window.setInterval( function(){ window.alert('v');}, 1000);
        window.open("chrome://sim_win/content/stop.xul", "stop", "chrome,top=0,left=0,modal,titlebar=no,alwaysRaised" );
//var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]  
//                             .getService(Components.interfaces.nsIWindowMediator);  
// var newWindow = wm.getMostRecentWindow("navigator:browser");  
// newWindow.getBrowser();  
        window.minimize();
    },
    
    loadPage: function(window)
    {
        const action = modules.action;
//        Components.utils.import("resource://modules/action.js", action);
        const mt=this;

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

        action.setAction('voipCall', this.voipCall, this);

        action.setAction('progExec', this.exec, this);
        action.setAction('progKill', this.kill, this);

        //const mainwindow = modules.mainwindow;
        modules.mainwindow.goHome();
        modules.mainwindow.getWindow().setInterval( " alert('tock');", 3000);
     },

    initWindow: function()
    {
        window.removeEventListener('load', app.initWindow, false);
        modules.mainwindow.setHome("chrome://sim_win/content/home.xul");
        modules.mainwindow.showWindow(window, function(){app.loadPage();});
    }
};

window.addEventListener('load', app.initWindow, false);

