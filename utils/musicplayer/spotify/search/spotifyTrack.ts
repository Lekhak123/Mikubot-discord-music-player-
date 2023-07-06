const playdl = require('play-dl');

export {searchSpotifyTrack};
const searchSpotifyTrack = async(spotifyTrackURL : string) => {
    try {
        if (playdl.is_expired()) {
            await playdl.refreshToken() // This will check if access token has expired or not. If yes, then refresh the token.
        };
        let sp_data = await playdl.spotify(spotifyTrackURL) // This will get spotify data from the url [ I used track url, make sure to make a logic for playlist, album ]
        const videoDetails = {
            source:"spotify",
            title:sp_data.name,
            url:sp_data.url,
        };
        let SongplayerInfo = {
            source: "spotify",
            type: "single",
            videoDetails: videoDetails
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "");
    };
};
