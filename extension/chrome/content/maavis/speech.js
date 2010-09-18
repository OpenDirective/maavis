function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
	pad.speakOnActivate = 'true';
    function mkItem( item )
    {
        item.action = ''; // noop
		return true;
    }
    page.addFolderKeys(pad, page.args.folderURL, false, mkItem);
}

window.addEventListener('load', loadPage, false);
