// do this here so that page.config gets set correctly 
const user = mainwindow.getProp("args");
if (user != '')
{
	page.user = user; // is persisted in config module
}

const config = {};
Components.utils.import("resource://modules/config.js", config);

function loadPage()
{

    window.removeEventListener('load', loadPage, false);
    
    window.onunload = function(){config.saveUserConfig();};
    
    const title = mainwindow.getElementById("title");
	title.label += ' for user ' + page.config.name;

    function f()
    {
		if (page.config.name != 'Default')
		{
			document.getElementById("sound_btn").collapsed = true;
		}
		else
		{
			if ( page.config.playStartSound == "yes") 
				document.getElementById("sound_btn").state = 'b';
		}
        if ( page.config.theme == "colour") 
            document.getElementById("theme_btn").state = 'b';
        if ( page.config.speakTitles == "yes") 
            document.getElementById("speech_btn").state = 'b';
        if ( page.config.speakOnActivate == "yes") 
            document.getElementById("speakactions_btn").state = 'b';
        if ( page.config.showLabels == "yes") 
            document.getElementById("showlabels_btn").state = 'b';
        if ( page.config.showImages == "yes") 
            document.getElementById("showimages_btn").state = 'b';
        if ( page.config.useSkype == "yes") 
            document.getElementById("skype_btn").state = 'b';
        if ( page.config.userType == "touch") 
            document.getElementById("usertype_btn").state = 'b';
        if ( page.config.scanMode == "USER1SWITCH" || page.config.scanMode == "AUTO1SWITCH" || page.config.scanMode == "AUTO1SWITCHAUTOSTART") 
            document.getElementById("nswitches_btn").state = 'b';
        if ( page.config.scanMode == "AUTO1SWITCH" || page.config.scanMode == "AUTO2SWITCH"
				|| page.config.scanMode == "AUTO1SWITCHAUTOSTART" || page.config.scanMode == "AUTO2SWITCHAUTOSTART")
		{
            document.getElementById("scanmode_btn").state = 'b';
			if ( page.config.scanMode == "AUTO1SWITCHAUTOSTART" || page.config.scanMode == "AUTO2SWITCHAUTOSTART") 
				document.getElementById("scanstart_btn").state = 'b';
		}
		else
		{
            document.getElementById("scanstart_btn").collapsed = true;
		}
    }
    window.setTimeout(f, 1); // so layout is correct
}

window.addEventListener('load', loadPage, false);


