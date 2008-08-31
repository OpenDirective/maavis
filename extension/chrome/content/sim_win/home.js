function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    Components.utils.import("resource://modules/utils.js");
    var users = config.getUsers();
    config.setCurrentUser(users[0]);
}

window.addEventListener('load', loadPage, false);


