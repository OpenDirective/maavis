function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    /*const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.action = 'showPage|audioplayer.xul,'+item.URI;
    }
    page.addFolderKeys(pad, "file:///%User%/Music/", true, mkItem);*/
}

window.addEventListener('load', loadPage, false);
