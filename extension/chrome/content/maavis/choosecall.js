function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    const pad = mainwindow.getElementById("pad");
    
    function mkItem( item )
    {
        try
        {   
            const name = item.name.split('-');
            item.name = utils.trim(name[0]);
            item.action = 'voipCall|' + utils.trim(name[1]);
            item.thumbURI = item.URI;
        }
        catch(e)
        {
        }
    }
    page.addFolderKeys(pad, "file:///%User%/Call/", false, mkItem);

}

window.addEventListener('load', loadPage, false);
