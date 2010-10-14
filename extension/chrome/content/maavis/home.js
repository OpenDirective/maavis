const config = {};
Components.utils.import("resource://modules/config.js", config);
const path = {};
Components.utils.import("resource://modules/path.js", path);
const skype = {};
Components.utils.import("resource://modules/skype.js", skype);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    const bConfig = config.getCommandLineConfig().config;
    if(!bConfig && page.config.useSkype == "yes")
    {
        skype.init();
    }
    
    const avatar = mainwindow.getElementById("avatar");
    const thumbnail = path.getThumbnailFile(config.getUserDataDir());
    if (thumbnail)
    {
        avatar.image = path.fileToURI(thumbnail);
    }

    const pad = mainwindow.getElementById("pad");
    if (!page.login)
    {
        const byeKey =  mainwindow.getElementById("quit");
        byeKey.setAttribute('hidden', 'true');
        /*const title =  mainwindow.getElementById("title");
        title.setAttribute('col', '0');
        title.setAttribute('cols', '10'); // assumes units in XUL
        pad.adjustKey(title);*/
    }
    
	function mkItem( item ) 
	{
		// Don't show call page button if can not call
		return (page.canCall || (item.action.indexOf('showPage|choosecall.xul') == -1));
	}
	
    page.addFolderKeys(pad, "file:///%UserDir%", true, mkItem, /^(?!Passwords$).*$/i);
}

window.addEventListener('load', loadPage, false);


