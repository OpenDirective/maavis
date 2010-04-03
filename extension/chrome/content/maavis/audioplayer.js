var path = {};
Components.utils.import("resource://modules/path.js", path);
var scan = {};
Components.utils.import("resource://modules/scan.js", scan);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    var mrls = mainwindow.getProp("args");
    
    const pad = document.getElementById("pad");
    if (!pad)
        return;
    const player = document.getElementById('player');
	
	function addPageButtons(mrls)
	{
		function addButton(item, index)
		{
			try 
			{        
				const file = path.URIToFile(item);
				const name = file.leafName.slice(0,-4);
				const action = 'mediaPlayItem|'+index.toString();
				const id = index;
				const key = pad.addSelectionsItem(name, null, 0, action, 'center', null, false, index);
				if (!key)
					return; // not on this page
				key.className = (player.nowPlaying == index) ? "playingmediatrack" : "mediatrack";
				if (page.isScanUser)
				{
					page._makeScanKey(key)
				}
				key.leftalignlabel = 'true';
			}
			catch(ex)
			{
				utils.logit(ex);
			}
		}
		
		const key = pad.addSelectionsItem('More music...', null, 0, 'callUserFunct|nextAudioPage', 'center', null, true, 'more');
		key.className = "mediatrack";
		if (page.isScanUser)
		{
			page._makeScanKey(key);
		}

		mrls.forEach(addButton);
	}
	
	function onNextPage()
	{
		const SELECTIONS_PAGE_PROP = 'selectionsPage';
	    var curpage =  mainwindow.getProp(SELECTIONS_PAGE_PROP);
		curpage = parseInt(curpage);
		curpage = (isNaN(curpage)) ? '0' : curpage;
		curpage = (curpage >= pad.lastSelectionsPage) ? 0 : curpage + 1;
		mainwindow.setProp(SELECTIONS_PAGE_PROP, curpage.toString() );
		
		pad.emptySelections();
		pad.setSelectionsPage(curpage, mrls.length);
		addPageButtons(mrls);
	}
	
	onNextPage();
	page.setUserAction('nextAudioPage', onNextPage);
	
    scan.holdScan();
    
    var obs = document.createElement('observes');
    obs.setAttribute("element", 'player_bc'); // TODO do reduce coupling
    obs.setAttribute("attribute", 'nowPlaying');
    const str = 'const node = this.parentNode;'
				+'node.selections.forEach(function(node){if (node.id != "more") node.className="mediatrack";});'
				+'const np = node.getAttribute("nowPlaying");'
				+'const ep = document.getElementById(np);'
				+'if (ep) {ep.className = "playingmediatrack";}'; // observer sets on parent
    obs.setAttribute("onbroadcast", str);
    pad.appendChild(obs);

    player.onPlayerReady = function(){ player.play(mrls); };
 }

window.addEventListener('load', loadPage, false);