const config = {};
Components.utils.import("resource://modules/config.js", config);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    if (page.config.userType == 'scan') // TODO temp so old screens still work
    {
        var user = mainwindow.getProp("args");
        user = (user=='') ? 'Default' : user;
        //mainwindow.setProp("user", user);
        config.setCurrentUser(user);
 
        const pad = mainwindow.getElementById("pad");
        page.addFolderKeys(pad, "file:///%UserDir%", true, null, /^(?!Passwords$).*$/i);
    }
}

window.addEventListener('load', loadPage, false);


