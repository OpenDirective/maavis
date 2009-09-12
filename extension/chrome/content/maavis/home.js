const config = {};
Components.utils.import("resource://modules/config.js", config);
const path = {};
Components.utils.import("resource://modules/path.js", path);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
/*    const avatarKey = mainwindow.getElementById("avatar");
    const thumbnail = path.getThumbnailFile(config.getUserDataDir());
    if (thumbnail)
    {
        avatarKey.image = thumbnail.path;
    }
*/
    if (!page.login)
    {
        const byeKey =  mainwindow.getElementById("quit");
        byeKey.setAttribute('hidden', 'true');
    }
    
    if (page.config.userType == 'scan') // TODO temp so old screens still work
    {
        const pad = mainwindow.getElementById("pad");
        page.addFolderKeys(pad, "file:///%UserDir%", true, null, /^(?!Passwords$).*$/i);
    }
}

window.addEventListener('load', loadPage, false);


