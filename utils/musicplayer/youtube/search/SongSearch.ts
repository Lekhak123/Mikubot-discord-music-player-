const playdl = require('play-dl');

export {searchSingleYTlink};

const searchSingleYTlink = async(songSearchArg : string) => {
    try {
        let yt_info = await playdl.search(songSearchArg, {
            limit: 1
        });
        const videoDetails = {
            title: yt_info[0].title,
            url: yt_info[0].url
        };
        let SongplayerInfo = {
            source:"youtube",
            type: "single",
            videoDetails:videoDetails,
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "Error occured");
    };
};