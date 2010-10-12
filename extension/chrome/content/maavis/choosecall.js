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
            if (item.name == 'Skype Video Test')
            {
                item.action = 'voipVideoTest';
            }
            else
            {
                item.action = 'voipCall|' + utils.trim(name[1]);
            }
            item.thumbURI = item.URI;
        }
        catch(e)
        {
			return false;
        }
		return true;
    }
	page.addFolderKeys(pad, page.args.folderURL, false, mkItem);

}

window.addEventListener('load', loadPage, false);
