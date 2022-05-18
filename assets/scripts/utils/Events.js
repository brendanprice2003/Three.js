import { AnimateScene } from './Effects';
import { userStruct, baseUri  } from '../user.js';

var log = console.log.bind(console);

const InitializeEvents = () => {

    // Initialize first view
    document.getElementById('moodBoard').style.display = 'none';
    userStruct.objs.currView.style.display = 'block';

    document.getElementById('btnMoodBoard').addEventListener('click', () => {

        userStruct.objs.currView.style.display = 'none';
        let element = document.getElementById('moodBoard');
            element.style.display = 'block';
            userStruct.objs.currView = element;
            userStruct.isAnimationPlaying = true;
            AnimateScene();

        document.getElementById('playlistGrid').style.display = 'block';
        document.getElementById('playlistContent').style.display = 'none';
    });

    document.getElementById('btnPlaylists').addEventListener('click', () => {

        userStruct.objs.currView.style.display = 'none';
        let element = document.getElementById('playlists');
            element.style.display = 'block';
            userStruct.objs.currView = element;
            userStruct.isAnimationPlaying = false;

        document.getElementById('playlistGrid').style.display = 'block';
        document.getElementById('playlistContent').style.display = 'none';
    });

    document.getElementById('btnPlayer').addEventListener('click', () => {

        userStruct.objs.currView.style.display = 'none';
        let element = document.getElementById('player');
            element.style.display = 'block';
            userStruct.objs.currView = element;
            userStruct.isAnimationPlaying = false;

        document.getElementById('playlistGrid').style.display = 'block';
        document.getElementById('playlistContent').style.display = 'none';
    });

    document.getElementById('btnUser').addEventListener('click', () => {

        userStruct.objs.currView.style.display = 'none';
        let element = document.getElementById('user');
            element.style.display = 'block';
            userStruct.objs.currView = element;
            userStruct.isAnimationPlaying = false;

        document.getElementById('playlistGrid').style.display = 'block';
        document.getElementById('playlistContent').style.display = 'none';
    });

    document.getElementById('settingsIcon').addEventListener('click', () => {

        userStruct.objs.currView.style.display = 'none';
        let element = document.getElementById('settings');
            element.style.display = 'block';
            userStruct.objs.currView = element;
            userStruct.isAnimationPlaying = false;

        document.getElementById('playlistGrid').style.display = 'block';
        document.getElementById('playlistContent').style.display = 'none';
    });

    document.getElementById('navBarLogoutContainer').addEventListener('click', () => {

        localStorage.clear();
        sessionStorage.clear();
        window.location.href = baseUri;
    });

    document.getElementById('submitButton').addEventListener('click', () => {

        // Omits strings
        let value = document.getElementById('size').value;
        if (Number.isInteger(parseInt(value))) {
            let userSettings = JSON.parse(localStorage.getItem('userSettings'));
                userSettings.moodboardItemSize = parseFloat(value);
                localStorage.setItem('userSettings', JSON.stringify(userSettings));
            window.location.reload();
        };

    });

};

export { InitializeEvents };