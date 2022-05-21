// Custom console log
console.log('%cSpotify Web API _V0.1', 'font-weight: bold;font-size: 25px;color: green;');
console.log('// Welcome to Spotify Web API, Please report any errors to @beru2003 on Twitter.');

// ES6 Imports
import { InitializeEvents } from './utils/Events';
import { AddText } from './utils/AddText';
import { UpdatePlaybackItem } from './utils/Helpers';

// Globals
var log = console.log.bind(console),
    authCode,
    clientId = '359dc43494fd4bdca5532550348fbb35',
    clientSecret = '55ce32e7350c46ae8ffcc0fd51b1f78d',
    redirectUri = `http://127.0.0.1:3000/assets/user.html`,
    baseUri = `http://127.0.0.1:3000/`;

var urlParams = new URLSearchParams(window.location.search),
    navbarIcon = document.getElementById('navBarIcon'),
    localStorage = window.localStorage,
    userStruct = {};
    navbarIcon.classList.add('navBarIconAnim'); // Start animation


// Configure userStruct
userStruct.objs = {};
userStruct.objs.currView = document.getElementById('user'); // Default
userStruct.isAnimationPlaying = false; // Toggle for pausing/playing animation
userStruct.playbackRefreshInterval = 3500; // Interval for refreshing user playback in ms

// Check if userSettings exist, if false then apply defaults
if (localStorage.getItem('userSettings')) {
    document.getElementById('size').value = JSON.parse(localStorage.getItem('userSettings')).moodboardItemSize;
}
else {
    var userSettings = {
        moodboardItemSize: 0.75, // Size of item names on the moodboard
    };
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
    document.getElementById('size').value = userSettings.moodboardItemSize;
};


// OAuth 2.0 flow
const OAuthFlow = async () => {

    var rsToken = JSON.parse(localStorage.getItem('refreshToken')),
        acToken = JSON.parse(localStorage.getItem('accessToken')),
        comps = JSON.parse(localStorage.getItem('components'));
    
        // ONLY place where authCode is to be fetched from
        let settingsConf = urlParams.get('fname');
        authCode = urlParams.get('code');

        // Clean URL
        window.history.pushState({}, document.title, window.location.pathname);

    // Wrap in try.except for error catching
    try {

        // If user has entered in setting config
        if (settingsConf) {
            var userSettings = JSON.parse(localStorage.getItem('userSettings'));
                userSettings.moodboardItemSize = settingsConf;
                localStorage.setItem('userSettings', JSON.stringify(userSettings));
        }

        // User comes back that has authorized beforehand
        else if (!authCode && (rsToken && acToken && comps)) {
            await CheckComponents();
        }

        // User re-authorizes but has authorized beforehand
        else if (authCode && (rsToken && acToken && comps)) {
            await AuthorizeUser(authCode);
        }

        // User has not authorized beforehand
        else if (authCode && (!rsToken && !acToken && !comps)) {
            await AuthorizeUser(authCode);
        }

        // Redirect back to index html page
        else {
            window.location.href = baseUri;
        };

    } 
    catch (error) {
        console.error(error); // display error page, with error and options for user
    };

    LoadUser(authCode);
};


// Get response from Spotify API that contains access key and refresh token
const AuthorizeUser = async (authCode) => {

    // Make request data
    let headerData = {
        headers: {
            Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}`,
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    // Fetch access token
    let AccessTokenRequest = await axios.post('https://accounts.spotify.com/api/token', `grant_type=authorization_code&code=${authCode}&redirect_uri=${redirectUri}`, headerData);

    // Store user information and store in localStorage
    let accessToken = {
            value: AccessTokenRequest.data['access_token'],
            expires_in: 3_600, // One hour
            inception: new Date().getTime()
        },
        refreshToken = {
            value: AccessTokenRequest.data['refresh_token'],
            expires_in: 7_776_000, // 90 Days
            inception: new Date().getTime()
        },
        components = {
            scope:  AccessTokenRequest.data.scope,
            token_type: AccessTokenRequest.data['token_type'],
            authCode: authCode
        };
    
        localStorage.setItem('accessToken', JSON.stringify(accessToken));
        localStorage.setItem('refreshToken', JSON.stringify(refreshToken));
        localStorage.setItem('components', JSON.stringify(components));
};


// Check user components to see if they are invalid or out of date
const CheckComponents = async () => {

    let acToken = JSON.parse(localStorage.getItem('accessToken')),
        headerData = {
            headers: {
                Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };

    // Check if access token has expired
    let isAcTokenExpired = (acToken.inception + acToken['expires_in']) <= Math.round(new Date().getTime() / 1000) - 1;
    if (isAcTokenExpired) {

        log('-> Refreshing User Components..');

        var rsToken = JSON.parse(localStorage.getItem('refreshToken')),
            comps = JSON.parse(localStorage.getItem('components'));

        // Refresh access token
        await axios.post('https://accounts.spotify.com/api/token', `grant_type=refresh_token&refresh_token=${rsToken.value}`, headerData)
        .then(res => {

            let rt = res.data; // Make it slightly quicker
            acToken = {
                expires_in: rt['expires_in'],
                value: rt['access_token'],
                inception: new Date().getTime(),
            };

            comps = {
                token_type: rt['token_type'],
                scope: rt.scope,
            };

            localStorage.setItem('accessToken', JSON.stringify(acToken));
            localStorage.setItem('components', JSON.stringify(comps));
        });

        log('-> User Components Refreshed');
    };
};


// Load basic user information
const LoadUser = async (authCode) => {

    // Check user components before doing anything else
    await CheckComponents();

    let acToken = JSON.parse(localStorage.getItem('accessToken')),
        headerData = {
            headers: {
                Authorization: `Bearer ${acToken.value}`,
                'Content-Type': 'application/json'
            }
        };
        
    userStruct.CurrentUserProfile = await axios.get('https://api.spotify.com/v1/me', headerData);

    // Load playback state once before going into recurisve loop below
    let playbackState = await axios.get('https://api.spotify.com/v1/me/player', headerData);
    if (playbackState.data.is_playing) {
        document.getElementById('playbackMixerInteract').src = '../assets/ico/pause.webp';
    };

    // First pass on user load
    UpdatePlaybackItem(headerData);

    // Tailing function calls on intervals
    setInterval( async () => {

        await CheckComponents();
        UpdatePlaybackItem(headerData);

    }, userStruct.playbackRefreshInterval);

    LoadContent(authCode);
};


// Load user content like user playlists and favourite tracks
const LoadContent = async () => {

    // Check user components before doing anything else
    await CheckComponents();

    let acToken = JSON.parse(localStorage.getItem('accessToken')),
        headerData = {
            headers: {
                Authorization: `Bearer ${acToken.value}`,
                'Content-Type': 'application/json'
            }
        };

    // Get user information
    let UserInformation = await axios.get(`https://api.spotify.com/v1/me`, headerData);

    if (UserInformation.data.images[0].url) {
        let navBarIcon = document.getElementById('navBarIcon');
            navBarIcon.src = UserInformation.data.images[0].url;
            navBarIcon.style.filter = 'invert(0)';
            navBarIcon.style.borderRadius = '50px';

        document.getElementById('userPfp').src = UserInformation.data.images[0].url;
    };

    // Get user playlists
    let UserPlaylists = await axios.get(`https://api.spotify.com/v1/me/playlists?limit=50&offset=0`, headerData),
        UserAlbums = await axios.get(`https://api.spotify.com/v1/me/albums?limit=50&market=GB&offset=0`, headerData),
        userItemCounter = 0;

    userItemCounter += UserPlaylists.data.items.length;
    userItemCounter += UserAlbums.data.items.filter(v => v.album.album_type === 'album' ? 1 : 0).length;

    // Change DOM elements on load
    document.getElementById('btnUser').innerHTML = `${UserInformation.data.display_name}`;
    document.getElementById('userName').innerHTML = `${UserInformation.data.display_name}`;
    document.getElementById('userFollowers').innerHTML = `${UserInformation.data.followers.total} ${document.getElementById('userFollowers').innerHTML}`;
    document.getElementById('userPlaylists').innerHTML = `${userItemCounter} ${document.getElementById('userPlaylists').innerHTML}`;
    
    let ArtistAffinity = await axios.get(`https://api.spotify.com/v1/me/top/artists`, headerData),
        TracksAffinity = await axios.get(`https://api.spotify.com/v1/me/top/tracks`, headerData);

    // Create new element for each affinitised artist
    for (let AffinityArtist of ArtistAffinity.data.items) {

        let artistImage = document.createElement('img');
            artistImage.id = 'item';
            artistImage.src = AffinityArtist.images[0].url;
            document.querySelector('#items').appendChild(artistImage);
            AddText(AffinityArtist.name);
    };

    // Create new element for each affinitised track
    for (let AffinityTrack of TracksAffinity.data.items) {

        let trackImage = document.createElement('img');
            trackImage.id = 'item';
            trackImage.src = AffinityTrack.album.images[0].url;
            document.querySelector('#items').appendChild(trackImage);
    };

    // Create new element for each user playlist
    for (let item of UserPlaylists.data.items) {

        let albumImageForMoodBoard = document.createElement('img');
            albumImageForMoodBoard.id = 'item';
            albumImageForMoodBoard.src = item.images[0].url;
            document.querySelector(`#items`).appendChild(albumImageForMoodBoard);

        let albumImageForPlaylists = document.createElement('img');
            albumImageForPlaylists.id = 'playlist';
            albumImageForPlaylists.src = item.images[0].url;
            document.querySelector(`#playlistGrid`).appendChild(albumImageForPlaylists);
            albumImageForPlaylists.addEventListener('click', () => {
                LoadPlaylistContent(item, headerData);
            });
    };

    // Create new element for each user album
    for (let item of UserAlbums.data.items) {
        if (item.album.album_type == 'album') {
            
            let albumImageForMoodBoard = document.createElement('img');
                albumImageForMoodBoard.id = 'item';
                albumImageForMoodBoard.src = item.album.images[0].url;
                document.querySelector(`#items`).appendChild(albumImageForMoodBoard);

            let albumImageForPlaylists = document.createElement('img');
                albumImageForPlaylists.id = 'playlist';
                albumImageForPlaylists.src = item.album.images[0].url;
                document.querySelector(`#playlistGrid`).appendChild(albumImageForPlaylists);
                albumImageForPlaylists.addEventListener('click', () => {
                    LoadPlaylistContent(item.album, headerData);
                });
        };
    };
};


// Load playlist content
const LoadPlaylistContent = async (playlist, headerData) => {

    // Toggle the view to show the resptictive playlists' content instead of grid of playlists
    document.getElementById('playlistGrid').style.display = 'none';
    document.getElementById('playlistContent').style.display = 'block';

    // Get the playlist
    let PlaylistTracks = await axios.get(`${playlist.tracks.href}`, headerData),
        rt = PlaylistTracks.data.items;
        
    for (let item in rt) {

        let topSeperator = document.createElement('hr'),
            track = document.createElement('div'),
            trackArtist = document.createElement('div'),
            trackLength = document.createElement('div'),
            trackLengthArr = (rt[item].track.duration_ms / 1000 / 60).toFixed(2).split('.'); // arr [ Minutes , Seconds ]
            
        topSeperator.classList.add('trackBreaker');

        trackArtist.id = 'trackArtist';
        track.id = 'track';
        trackLength.id = 'trackLength';
        track.innerHTML = rt[item].name || rt[item].track.name;
        trackLength.innerHTML = `${trackLengthArr[0]}:${trackLengthArr[1]}`;

        // Add arists and append to string with commas accordingly
        for (let artist of  rt[item].artists || rt[item].track.artists) {
            if (!trackArtist.innerHTML) {
                trackArtist.innerHTML += artist.name;
            }
            else if (trackArtist.innerHTML) {
                trackArtist.innerHTML += `, ${artist.name}`;
            };
        };

        // Append child DOM content to parent DOM content
        track.appendChild(trackLength);
        track.appendChild(trackArtist);
        track.appendChild(topSeperator);
        document.querySelector('#playlistContent').appendChild(track);
    };
};


(async () => {

    // OAuth Flow
    await OAuthFlow();

    // Create events for HTML elements
    InitializeEvents();

})()
.catch (error => {
    console.error(error);
});

export { userStruct, baseUri, authCode, CheckComponents };