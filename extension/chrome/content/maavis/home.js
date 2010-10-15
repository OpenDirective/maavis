const config = {};
Components.utils.import("resource://modules/config.js", config);
const path = {};
Components.utils.import("resource://modules/path.js", path);
const skype = {};
Components.utils.import("resource://modules/skype.js", skype);

            
function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    const pad = mainwindow.getElementById("pad");

    const bConfig = config.getCommandLineConfig().config;
    if(!bConfig && page.config.useSkype == "yes")
    {
        function onOutcome(what)
        {
            if (what == 'attach_success')
            {
                const klassname = (page.isScanUser) ? 'choosecallbutton scankey' : 'choosecallbutton';
                var keys = pad.content.getElementsByClassName(klassname);
                Array.forEach(keys, function(e, i, a){e.setAttribute("disabled", "false");});
            }
            else if (what == 'attach_failed')
            {
                alert('Skype is not responding.\n\nYou may need to sign in to Skype or authorise access for MaavisSkypeServer.\n\nIf you press the Ctrl + Esc keys you will be able to open Skype from the task bar tray icon with a right click and then authorise the MaavisSkypeServer.');
            }
            else if (what == 'not_installed')
            {
                alert('Skype is does not appear to be installed and SkypePortable cannot be found.');
            }
        }
        
        if (!skype.isAvailable()) // so only first time to home page
            skype.init(onOutcome);
    }
    
    const avatar = mainwindow.getElementById("avatar");
    const thumbnail = path.getThumbnailFile(config.getUserDataDir());
    if (thumbnail)
    {
        avatar.image = path.fileToURI(thumbnail);
    }

    if (!page.login)
    {
        const byeKey =  mainwindow.getElementById("quit");
        byeKey.setAttribute('hidden', 'true');
    }
    
	function mkItem( item ) 
	{
        const choosecallbutton = (item.action.indexOf('showPage|choosecall.xul') != -1);

        if (!choosecallbutton)
            return true
            
		if (page.config.useSkype != "yes")
            return false;  // hide it
            
        if (!skype.isAvailable() && item.action.indexOf('showPage|choosecall.xul') != -1)
        {
            item.disabled = true;
            item.klassname = 'choosecallbutton';
        }
        return true;
	}
	
    page.addFolderKeys(pad, "file:///%UserDir%", true, mkItem, /^(?!Passwords$).*$/i);
}

window.addEventListener('load', loadPage, false);


