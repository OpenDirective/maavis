var EXPORTED_SYMBOLS = ["getWindowIntArgument", "setWindowSize"];

function getWindowIntArgument(window, index)
{
    var arg = undefined;
    if ("arguments" in window && 
        window.arguments[0] instanceof Components.interfaces.nsIDialogParamBlock)
    {
        arg = window.arguments[0].GetInt(0);
    }
    return arg;
}

function  setWindowSize(window)
{
    function setWindowFullscreen() 
    {
        window.resizeTo(window.screen.Width, window.screen.Height);
        window.setTimeout('window.fullScreen = true;', 500);   // lose border
    }

    const bKiosked = Boolean(getWindowIntArgument(window, 0));
    if (bKiosked)
    {
        window.setTimeout(setWindowFullscreen, 500); // must be async to work and cover Windows task bar
    }
}

