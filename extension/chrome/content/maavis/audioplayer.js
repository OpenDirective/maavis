var path = {};
Components.utils.import("resource://modules/path.js", path);
var scan = {};
Components.utils.import("resource://modules/scan.js", scan);

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
            var key = null;
            if (page.config.userType == 'scan')
                key =pad.addSelectionsItem('More...', null, 0, null, 'center');
            else
                key = pad.createKey(row++, 0, 1, 6, 'More...', null, 0, null, 'center'); //TODO temp so old pages work
            key.className += " mediatrack";
            if (page.config.userType == 'scan')
            {
                key.className += ' scankey'
            }
		}
		else
		{
			try 
			{        
				const file = path.URIToFile(item);
				const name = file.leafName.slice(0,-4);
				const action = 'mediaPlayItem|'+(row-1).toString();
                if (page.config.userType == 'scan')
                {
                    key = pad.addSelectionsItem(name, null, 0, action, 'center');
                    row++;
                }
                else
                    key = pad.createKey(row++, 0, 1, 6, name, null, 0, action, 'center');
				key.className += " mediatrack";
                if (page.config.userType == 'scan')
                {
                    key.className += ' scankey'
                }
                key.leftalignlabel = 'true';
			}
			catch(ex)
			{
                utils.logit(ex);
			}
		}
    }
    mrls.forEach(addButton);

    var player = document.getElementById('player');
    scan.holdScan();
    player.onPlayerReady = function(){ player.play(mrls); };
 }

window.addEventListener('load', loadPage, false);