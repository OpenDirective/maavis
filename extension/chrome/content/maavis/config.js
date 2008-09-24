function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    function f()
    {
        if (actions.getColour() == "colour") 
            document.getElementById("theme_btn").state = 'b';
        if (actions.getSpeech() == "speech") 
            document.getElementById("speech_btn").state = 'b';
    }
    window.setTimeout(f, 300); // so layout is correct
    /*
    if (actions.getComplexity() != "full") 
        document.getElementById("complexity_btn").state = 'b';
    */
}

window.addEventListener('load', loadPage, false);


