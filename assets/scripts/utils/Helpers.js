import { CheckComponents } from '../user';

let currentItemName = document.getElementById('currPlayingItemName'),
    currentAristInfo = document.getElementById('currPlayingItemAuthor'),
    log = console.log.bind(console);

const UpdatePlaybackItem = async (headerData) => {

    // Check user components before doing anything else
    await CheckComponents();

    let UserCurrentPlayback = await axios.get('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track&market=GB', headerData),
        data = UserCurrentPlayback.data.item;

    try {
        currentItemName.innerHTML = '';
        currentAristInfo.innerHTML = '';
        currentItemName.innerHTML = `${data.name}`;
        currentAristInfo.innerHTML = `${data.artists[0].name}`;

        // Limit the length of the track name
        let trackName = data.name;
        if (data.name.length > 17) {
            trackName = data.name.slice(0, 17);
            trackName += '..';
        };

        // Update mixer
        playbackMixerTrackName.innerHTML = '';
        playbackMixerArtistName.innerHTML = '';
        playbackMixerTrackName.innerHTML = `${trackName}`;
        playbackMixerArtistName.innerHTML = `${data.artists[0].name}`;
        playbackMixerBg.src = `${data.album.images[0].url}`;

    }
    catch (e) {

        console.error(e);
        currentAristInfo.innerHTML = `User is not currently jammin' out to anything`;
        playbackMixerTrackName.innerHTML = '-';
        playbackMixerArtistName.innerHTML = '-';
        playbackMixerInteract.src = '../assets/ico/play.webp';
    };
};

const PauseMusic = async () => {

    let acToken = JSON.parse(localStorage.getItem('accessToken')),
        headerData = {
            headers: {
                Authorization: `Bearer ${acToken.value}`,
                'Content-Type': 'application/json'
            }
        };

    let playbackState = await axios.get('https://api.spotify.com/v1/me/player', headerData),
        devices = await axios.get('https://api.spotify.com/v1/me/player/devices', headerData),
        device = devices.data.devices.filter(v => v.is_active)[0];

    // Pause playback
    if (playbackState.data.is_playing) {
        playbackMixerInteract.src = '../assets/ico/play.webp';
        await axios.put(`https://api.spotify.com/v1/me/player/pause`, device, headerData);
    }

    // Resume playback
    else if (!playbackState.data.is_playing) {
        playbackMixerInteract.src = '../assets/ico/pause.webp';
        await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device.id}`, {body: {context_uri: playbackState.data.item.uri}}, headerData);
    };
};

export { UpdatePlaybackItem, PauseMusic };