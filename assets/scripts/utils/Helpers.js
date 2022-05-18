
let currentItemName = document.getElementById('currPlayingItemName'),
    currentAristInfo = document.getElementById('currPlayingItemAuthor');

const UpdatePlaybackItem = async (headerData) => {

    let UserCurrentPlayback = await axios.get('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track&market=GB', headerData),
        data = UserCurrentPlayback.data.item;

    try {
        currentItemName.innerHTML = '';
        currentAristInfo.innerHTML = '';
        currentItemName.innerHTML = `${data.name}`;
        currentAristInfo.innerHTML = `${data.artists[0].name}`;
    }
    catch (e) {
        // console.error(e);
        currentAristInfo.innerHTML = `User is not currently jammin' out to anything`;
    };
};

const PauseMusic = async (headerData) => {

    let playbackState = await axios.get('https://api.spotify.com/v1/me/player', headerData),
        anbar = await axios.get('https://api.spotify.com/v1/me/player/devices', headerData),
        device = anbar.data.devices.filter(v => v.is_active)[0];
        console.log(anbar);

    if (playbackState.data.is_playing) {

        // Pause playback
        await axios.put(`https://api.spotify.com/v1/me/player/pause`, device, headerData);
    }
    else {

        // let body = {
        //     body: {
        //         context_uri: 
        //     }
        // };

        console.log(playbackState);

        // Resumse playback
        await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${device.id}`, headerData);
    };

    

};

export { UpdatePlaybackItem, PauseMusic };