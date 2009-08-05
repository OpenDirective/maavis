var path = {};
Components.utils.import("resource://modules/path.js", path);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    var mrls = mainwindow.getProp("args");
    
    var row = 1;
    const MAXROWS = 9;
    const pad = document.getElementById("pad");
    if (!pad)
        return;
	
    function addButton(item)
    {
        if (row > MAXROWS)
		{
            return;
		}
        else if (row == MAXROWS)
		{
            var key = pad.createKey(row++, 0, 1, 6, 'More...', null, 0, null, 'center');
            key.className += " mediatrack";
		}
		else
		{
			try 
			{        
				const file = path.URIToFile(item);
				const name = file.leafName.slice(0,-4);
				const action = 'mediaPlayItem|'+(row-1).toString();
				key = pad.createKey(row++, 0, 1, 6, name, null, 0, action, 'center');
				key.className += " mediatrack";
			}
			catch(e)
			{
			}
		}
    }
    mrls.forEach(addButton);

    var player = document.getElementById('player');
    player.onPlayerReady = function(){ player.play(mrls); };
 }

window.addEventListener('load', loadPage, false);