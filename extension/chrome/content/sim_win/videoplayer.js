var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);

function loadPage()
{
    var mainwindow = {};
    Components.utils.import("resource://modules/mainwindow.js", mainwindow);

    window.removeEventListener('load', loadPage, false);
    
    const args = mainwindow.getProps();
    const mrl = 'file://h:/sim_win/media/' + args[0];
    
    var player = document.getElementById('player');
    player.onPlayerReady = function(){ player.play(mrl); };
}

window.addEventListener('load', loadPage, false);