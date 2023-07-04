const playdl = require('play-dl');

export {searchSpotifyPlaylistAlbum};
const searchSpotifyPlaylistAlbum = async(spotifyPLaylistAlbumURL : string) => {
    try {
        if (playdl.is_expired()) {
            await playdl.refreshToken() // This will check if access token has expired or not. If yes, then refresh the token.
        };
        const playlist = await playdl.spotify(spotifyPLaylistAlbumURL);

        const tracks = await playlist.all_tracks();
        let songNameList : Array < any >= [];
        for (let x in tracks) {
            songNameList.push({
                name: tracks[x]
                    ?.name,
                url: tracks[x]
                    ?.url
            });
        };
        let SongplayerInfo = {
            source: "spotify",
            type: "multiple",
            videoDetails: songNameList
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "");
    };
};
