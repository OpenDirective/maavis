var winutils = {};
Components.utils.import("resource://modules/winutils.js", winutils);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    winutils.setWindowFullscreen(window);
    Components.utils.import("resource://modules/execute.js");
    document.title = stopWindowName;
    
    // need to do this else never redraws and geta zombie process.    
//    window.document.getElementsByTagName('window')[0].style.background='transparent';
//    function unloadPage()
//    {
//        window.document.getElementsByTagName('window')[0].style.background='white';
//        winutils.setWindowFullscreen(window);
//    }
    window.addEventListener('unload', unloadPage, false);
}

window.addEventListener('load', loadPage, false);
