function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    Components.utils.import("resource://modules/execute.js");
    document.title = stopWindowName;
}

window.addEventListener('load', loadPage, false);


