
let currentItemName = document.getElementById('currPlayingItemName'),
    currentAristInfo = document.getElementById('currPlayingItemAuthor');

const UpdatePlaybackItem = async (headerData) => {
    let UserCurrentPlayback = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', headerData),
        data = UserCurrentPlayback.data.item;

    try {
        currentItemName.innerHTML = '';
        currentAristInfo.innerHTML = '';
        currentItemName.innerHTML = `${data.name}`;
        currentAristInfo.innerHTML = `${data.artists[0].name}`;
    }
    catch (e) {
        currentAristInfo.innerHTML = `User is not currently jammin' out to anything`;
    };
};

export { UpdatePlaybackItem };