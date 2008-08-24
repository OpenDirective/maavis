var mainwindow = {};
Components.utils.import("resource://modules/mainwindow.js", mainwindow);

function loadPage()
{
    var mainwindow = {};
    Components.utils.import("resource://modules/mainwindow.js", mainwindow);

    window.removeEventListener('load', loadPage, false);
    
    const props = mainwindow.getProps();
    
    const stop = document.getElementById('stop')
    stop.addEventListener('command', function(){ player.stop(); mainwindow.goHome();}, false);

    var player = document.getElementById('player');
    player.onPlayerReady = function(){ player.play(props.mrl);};
}

window.addEventListener('load', loadPage, false);