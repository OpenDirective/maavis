var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);


function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const args = mainwindow.getProps();
    var player = document.getElementById('player');
    player.onPlayerReady = function(){ player.play(args[0]); };
}

window.addEventListener('load', loadPage, false);