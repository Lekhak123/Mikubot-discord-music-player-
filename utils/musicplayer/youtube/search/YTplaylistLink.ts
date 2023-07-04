const ytpl = require('ytpl');
export {searchYTPlaylist};

const searchYTPlaylist = async(playlistUrl : string) => {
    // Fetch playlist details
    let playlist : any;
    try {
        playlist = await ytpl(playlistUrl);
        let playlistdata : Array < any > = [];
        for (let x in playlist) {
            playlistdata.push({
                url: playlist[x]
                    ?.url,
                title: playlist[x]
                    ?.title,
                source: "yt"
            });
        };
        let SongplayerInfo = {
            source: "yt",
            type: "multiple",
            videoDetails: playlistdata
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "Error occured");
    };
};