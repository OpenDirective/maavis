function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const mrls = mainwindow.getProp("args")[0];
    var player = document.getElementById('player');
    player.onPlayerReady = function(){ player.play(mrls); };
}

window.addEventListener('load', loadPage, false);