import { userStruct } from '../user.js';

// Expose necessary variables to console
$(document).ready(function () {

    $.uts = () => {
        return userStruct;
    };

    $.user = () => {
        return userStruct.CurrentUserProfile;
    };

    $.upl = () => {
        return userStruct.userPlaylists;
    };
});