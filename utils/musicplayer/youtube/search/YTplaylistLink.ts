const ytpl = require('ytpl');
export {searchYTPlaylist};

const searchYTPlaylist = async(playlistUrl : string) => {
    // Fetch playlist details
    let playlist : any;
    try {
        playlist = await ytpl(playlistUrl);
        let SongplayerInfo = {
            source:"youtube",
            type: "multiple",
            videoDetails: playlist
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "Error occured");
    };
};