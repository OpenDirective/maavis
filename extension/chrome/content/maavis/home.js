function loadPage()
{
    window.removeEventListener('load', loadPage, false);
	
    const pad = mainwindow.getElementById("pad");
    page.addFolderKeys(pad, "file:///%User%", true, null);
}

window.addEventListener('load', loadPage, false);


