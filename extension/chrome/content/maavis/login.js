// do this here so that page.config gets set correctly 
page.user = null; // back to default

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
        try
        {   
            item.action = 'showPage|password.xul,'+item.name;
        }
        catch(e)
        {
        }
    }
    const nItems = page.addFolderKeys(pad, "file:///%UsersDir%", true, mkItem, /^(?!Default$).*$/i);
    if (nItems == 0)
        page.addFolderKeys(pad, "file:///%UsersDir%", true, mkItem, /^Default$/i);
}

window.addEventListener('load', loadPage, false);


