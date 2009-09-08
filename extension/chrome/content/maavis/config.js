const config = {};
Components.utils.import("resource://modules/config.js", config);

function loadPage()
{
    window.removeEventListener('load', loadPage, false);
    
    window.onunload = function(){ config.saveUserConfig();};
    
    function f()
    {
        if ( page.config.userType == "touch") 
            document.getElementById("usertype_btn").state = 'b';
        if ( page.config.theme == "colour") 
            document.getElementById("theme_btn").state = 'b';
        if ( page.config.playStartSound == "yes") 
            document.getElementById("sound_btn").state = 'b';
        if ( page.config.speakTitles == "yes") 
            document.getElementById("speech_btn").state = 'b';
        if ( page.config.showLabels == "yes") 
            document.getElementById("showlabels_btn").state = 'b';
        if ( page.config.showImages == "yes") 
            document.getElementById("showimages_btn").state = 'b';
        if ( page.config.useSkype == "yes") 
            document.getElementById("skype_btn").state = 'b';
        if ( page.config.scanMode == "USER1SWITCH" || page.config.scanMode == "AUTO1SWITCH") 
            document.getElementById("nswitches_btn").state = 'b';
        if ( page.config.scanMode == "AUTO1SWITCH" || page.config.scanMode == "AUTO2SWITCH") 
            document.getElementById("scanmode_btn").state = 'b';
    }
    window.setTimeout(f, 1); // so layout is correct
}

window.addEventListener('load', loadPage, false);


