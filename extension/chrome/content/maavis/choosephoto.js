function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.action = 'showPage|slideshow.xul,' + item.URI;
    }
    page.addFolderKeys(pad, "file:///%User%/Photos/", bDirs=true, mkItem);
}

window.addEventListener('load', loadPage, false);
