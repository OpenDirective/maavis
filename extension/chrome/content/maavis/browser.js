function loadPage()
{
    window.removeEventListener('load', loadPage, false);
 
    const url = mainwindow.getProp("args")[0];
    var browser = document.getElementById('browser');
    browser.setAttribute("src", url);


browser.contentWindow.addEventListener('load', function(){alert('clicked');}, false);
    
}

window.addEventListener('load', loadPage, false);

