function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.action = 'showPage|audioplayer.xul,'+item.URI;
    }
    const mrls = mainwindow.getProp("args");
	alert(mrls);
    page.addFolderKeys(pad, "file:///%User%/Music/", true, mkItem);
}

window.addEventListener('load', loadPage, false);
