function loadPage()
{
    window.removeEventListener('load', loadPage, false);
 
    const url = mainwindow.getProp("args")[0];
    var browser = document.getElementById('browser');
    browser.setAttribute("src", url);
 
/*    var row = 1;
    function addPad(item)
    {
       const pad = mainwindow.getElementById("pad");
       var key = pad.createKey(row++, 3, 1, 1, item.name, null, "browseTo|"+ item.uri);
     }
    
    var items = config.getUserConfig().web;
    items.forEach(addPad);
*/


}

window.addEventListener('load', loadPage, false);

