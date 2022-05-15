import { userStruct, baseUri  } from '../user.js';

var log = console.log.bind(console);

const InitializeEvents = () => {

    // Initialize first view
    document.getElementById('moodBoard').style.display = 'none';
    userStruct.objs.currView.style.display = 'block';

    document.getElementById('btnMoodBoard').addEventListener('click', () => {
        userStruct.objs.currView.style.display = 'none';
        document.getElementById('moodBoard').style.display = 'block';
        userStruct.objs.currView = document.getElementById('moodBoard');
    });
    document.getElementById('btnPlaylists').addEventListener('click', () => {
        userStruct.objs.currView.style.display = 'none';
        document.getElementById('playlists').style.display = 'block';
        userStruct.objs.currView = document.getElementById('playlists');
    });
    document.getElementById('btnUser').addEventListener('click', () => {
        userStruct.objs.currView.style.display = 'none';
        document.getElementById('user').style.display = 'block';
        userStruct.objs.currView = document.getElementById('user');
    });
    document.getElementById('settingsIcon').addEventListener('click', () => {
        userStruct.objs.currView.style.display = 'none';
        document.getElementById('settings').style.display = 'block';
        userStruct.objs.currView = document.getElementById('settings');
    });

    document.getElementById('navBarLogoutContainer').addEventListener('click', () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = baseUri;
    });

};

export { InitializeEvents };