function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    //alert(window.screen.width +' ' + window.outerWidth)
    window.moveTo(window.screen.width - window.outerWidth, 0);

    Components.utils.import("resource://modules/execute.js");
    document.title = stopWindowName;
}

window.addEventListener('load', loadPage, false);


