// do this here so that page.config gets set correctly 
page.user = null; // back to default

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    const pad = mainwindow.getElementById("pad");
    function mkItem( item )
    {
		item.action = 'showPage|config.xul,'+item.name;
		return true;
    }
	page.addFolderKeys(pad, "file:///%UsersDir%", true, mkItem);
    //page.addFolderKeys(pad, "file:///%UsersDir%", true, mkItem, /^(?!Default$).*$/i);
}

window.addEventListener('load', loadPage, false);


