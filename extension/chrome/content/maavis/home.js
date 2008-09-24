function loadPage()
{
    window.removeEventListener('load', loadPage, false);
}

window.addEventListener('load', loadPage, false);


