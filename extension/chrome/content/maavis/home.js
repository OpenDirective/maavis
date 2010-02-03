const config = {};
Components.utils.import("resource://modules/config.js", config);
const path = {};
Components.utils.import("resource://modules/path.js", path);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
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
    
    page.addFolderKeys(pad, "file:///%UserDir%", true, null, /^(?!Passwords$).*$/i);
}

window.addEventListener('load', loadPage, false);


