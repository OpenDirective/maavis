var EXPORTED_SYMBOLS = ["getWindowIntArgument", "setWindowFullscreen"];

function getWindowIntArgument(window, index)
{
    var arg = undefined;
    if ("arguments" in window && 
        window.arguments[0] instanceof Components.interfaces.nsIDialogParamBlock)
    {
        arg = window.arguments[0].GetInt(index);
    }
    return arg;
}

function setWindowFullscreen(window) 
{
    window.moveTo(0, 0);
    window.resizeTo(window.screen.width, window.screen.height);
    //function f (){ window.fullScreen = true; }
    //window.setTimeout(f, 1);   // lose border
}

