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
                if (item.name[0] == '!')
                {
                    item.name = item.name.slice(1);
                    item.action = 'showPage|home.xul,'+user;
                }
                else
                {
                    item.action = 'showPage|login.xul,';
                }
                item.thumbURI = item.URI;
            }
            catch(e)
            {
            }
        }
        const user = mainwindow.getProp("args");
 
        page.addFolderKeys(pad, "file:///%UsersDir%/"+user+'/Passwords', false, mkItem);
    }
}

window.addEventListener('load', loadPage, false);


