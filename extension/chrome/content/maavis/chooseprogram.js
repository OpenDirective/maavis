function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        //utils.logit(item.thumbURI +' '+ item.URI+' '+item.arg);
        item.action = 'progExec|'+item.arg;
    }
    page.addFolderKeys(pad, page.args.folderURL, false, mkItem);
}

window.addEventListener('load', loadPage, false);
