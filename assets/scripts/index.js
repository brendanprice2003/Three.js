
// Globals
var log = console.log.bind(console),
    clientId = '359dc43494fd4bdca5532550348fbb35',
    clientSecret = '55ce32e7350c46ae8ffcc0fd51b1f78d',
    url = `https://accounts.spotify.com/authorize`,
    redirectUri = 'http://127.0.0.1:3000/assets/user.html';

// Custom console log
log('%cSpotify Web API _V0.1', 'font-weight: bold;font-size: 25px;color: green;');
log('// Welcome to Spotify Web API, Please report any errors to @beru2003 on Twitter.');


// Tailing function to generate state parameter
var GenerateState = (len) => {
    let result = ' ';
    let characters ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    };
    return result;
};


// Authorize button listener
document.getElementById('btnAuthorize').addEventListener('click', () => {

    var state = GenerateState(16);

    localStorage.setItem('stateKey', state);
    var scope = '',
        scopesArr = [
            'user-read-playback-state',
            'user-read-email',
            'user-read-private',
            'user-top-read',
            'user-read-currently-playing',
            'user-library-read',
            'user-modify-playback-state'
        ];
    
    for (let i=0; i < scopesArr.length; i++) {

        if (i === 0) {
            scope += scopesArr[i];
        }
        else {
            scope += ` ${scopesArr[i]}`;
        };
    };

    url += '?response_type=code';
    url += '&client_id=' + encodeURIComponent(clientId);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirectUri);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
});