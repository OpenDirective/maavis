function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.action = 'showPage|slideshow.xul,' + item.URI;
		return true;
    }
    page.addFolderKeys(pad, page.args.folderURL, true, mkItem);
}

window.addEventListener('load', loadPage, false);
