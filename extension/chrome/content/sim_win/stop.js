function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    Components.utils.import("resource://modules/actions.js");
    const objWnd = window.getElementById("wnd");
    objWnd.setAttribute("title", stopWindowName);
}

window.addEventListener('load', loadPage, false);


