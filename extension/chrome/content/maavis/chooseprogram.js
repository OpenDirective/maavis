function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        item.action = 'progExec|'+item.arg;
        //item.thumbURI = item.URI;
    }
    page.addFolderKeys(pad, "file:///%UserDir%/Programs/", false, mkItem);
}

window.addEventListener('load', loadPage, false);
