function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    window.onunload = function(){ config.saveUserConfig();};
    
    function f()
    {
        if ( page.config.theme == "colour") 
            document.getElementById("theme_btn").state = 'b';
        if ( page.config.playStartSound == "yes") 
            document.getElementById("sound_btn").state = 'b';
        if ( page.config.speakTitles == "yes") 
            document.getElementById("speech_btn").state = 'b';
        if ( page.config.showText== "yes") 
            document.getElementById("showtext_btn").state = 'b';
        if ( page.config.showImages== "yes") 
            document.getElementById("showimages_btn").state = 'b';
        if ( page.config.useSkype== "yes") 
            document.getElementById("skype_btn").state = 'b';
    }
    window.setTimeout(f, 1); // so layout is correct
    /*
    if (actions.getComplexity() != "full") 
        document.getElementById("complexity_btn").state = 'b';
    */
}

window.addEventListener('load', loadPage, false);


