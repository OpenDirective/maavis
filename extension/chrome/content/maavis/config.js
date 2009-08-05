function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    function f()
    {
        if (config.getColour() == "colour") 
            document.getElementById("theme_btn").state = 'b';
        if (config.getSpeech() == "speech") 
            document.getElementById("speech_btn").state = 'b';
    }
    window.setTimeout(f, 200); // so layout is correct
    /*
    if (actions.getComplexity() != "full") 
        document.getElementById("complexity_btn").state = 'b';
    */
}

window.addEventListener('load', loadPage, false);


