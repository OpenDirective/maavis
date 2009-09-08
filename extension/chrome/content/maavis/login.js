const config = {};
Components.utils.import("resource://modules/config.js", config);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    if (page.config.userType == 'scan') // TODO temp so old screens still work
    {
        const pad = mainwindow.getElementById("pad");
        function mkItem( item )
        {
            try
            {   
                item.action = 'showPage|password.xul,'+item.name;
                //item.thumbURI = item.URI;
            }
            catch(e)
            {
            }
        }
        page.addFolderKeys(pad, "file:///%UsersDir%", true, mkItem, /^(?!Default$).*$/i);
    }
}

window.addEventListener('load', loadPage, false);


