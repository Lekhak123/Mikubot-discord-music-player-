const playdl = require('play-dl');

export {searchSpotifyPlaylistAlbum};
const searchSpotifyPlaylistAlbum = async(spotifyPLaylistAlbumURL : string) => {
    try {
        if (playdl.is_expired()) {
            await playdl.refreshToken() // This will check if access token has expired or not. If yes, then refresh the token.
        };
        // let spotifyurl =
        // "https://open.spotify.com/track/3PfmTIgCXBWPQCzcPhs7oX?si=b1ac0a27f0ff4566"
        let sp_data = await playdl.spotify(spotifyPLaylistAlbumURL) // This will get spotify data from the url [ I used track url, make sure to make a logic for playlist, album ]
        let searched = await playdl.search(`${sp_data.name}`, {limit: 1}) // This will search the found track on youtube.
        const videoDetails = {
            title: searched[0].title,
            url: searched[0].url
        };
        let SongplayerInfo = {
            source:"spotify",
            type: "multiple",
            videoDetails: videoDetails
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "");
    };
};
