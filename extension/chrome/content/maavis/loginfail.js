const config = {};
Components.utils.import("resource://modules/config.js", config);

// do this here so that page.config gets set correctly 
page.user = null; // back to default
    
function loadPage()
{
    window.removeEventListener('load', loadPage, false);
}

window.addEventListener('load', loadPage, false);


