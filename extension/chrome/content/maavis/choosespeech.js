function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
	pad.speakOnActivate = 'true';
    function mkItem( item )
    {
        item.action = 'showPage|speech.xul,'+item.arg;
		return true;
    }
    page.addFolderKeys(pad, page.args.folderURL, true, mkItem);
}

window.addEventListener('load', loadPage, false);
