function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    if (page.config.userType == 'scan') // TODO temp so old screens still work
    {
        const pad = mainwindow.getElementById("pad");
        page.addFolderKeys(pad, "file:///%User%", true, null);
    }
}

window.addEventListener('load', loadPage, false);


