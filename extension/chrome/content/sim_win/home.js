function loadPage()
{
    window.removeEventListener('load', loadPage, false);

    var users = config.getUsers();
    config.setCurrentUser(users[0]);
}

window.addEventListener('load', loadPage, false);


