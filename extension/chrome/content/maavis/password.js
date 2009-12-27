// do this here so that page.config gets set correctly 
page.user = mainwindow.getProp("args"); // is persisted in config module

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    const pad = mainwindow.getElementById("pad");
    const showLabels  = (page.config.passwordItems != "images");
    pad.setAttribute("showLabels", (showLabels) ? "true" : "false");
    const showImages  = (page.config.passwordItems != "labels");
    pad.setAttribute("showImages", (showImages) ? "true" : "false");
   function mkItem( item )
    {
        try
        {   
            if (item.name[0] == '!')
            {
                item.name = item.name.slice(1);
                item.action = 'showPage|home.xul';
            }
            else
            {
                item.action = 'showPage|loginfail.xul';
            }
        }
        catch(e)
        {
            utils.logit(e);
        }
    }
    
    try
    {
        page.addFolderKeys(pad, 'file:///%UserDir%/Passwords', false, mkItem);
    }
    catch (e)
    {
        actions.goHome();
    } 
}

window.addEventListener('load', loadPage, false);
