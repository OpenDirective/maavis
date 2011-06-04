function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    //window.moveTo(window.screen.width - window.outerWidth, 0); // outerWidth is 1?
    window.moveTo(window.screen.width - 181, 1);

    Components.utils.import("resource://modules/execute.js");
    document.title = stopWindowName;
}

window.addEventListener('load', loadPage, false);


