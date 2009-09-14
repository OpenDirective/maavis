function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.thumbURI = item.URI;
        item.action = 'showPage|browser.xul,'+item.arg;
    }
    page.addFolderKeys(pad, "file:///%UserDir%/Information/", false, mkItem);
}

window.addEventListener('load', loadPage, false);
