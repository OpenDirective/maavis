function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        //item.thumbURI = item.URI;
        item.action = 'showPage|browser.xul,'+item.arg;
		return true;
    }
    page.addFolderKeys(pad, page.args.folderURL, false, mkItem);
}

window.addEventListener('load', loadPage, false);
