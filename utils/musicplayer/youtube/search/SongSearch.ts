const playdl = require('play-dl');

export {searchYTsong};

const searchYTsong = async(songSearchArg : string) => {
    try {
        let yt_info = await playdl.search(songSearchArg, {
            limit: 1
        });
        const videoDetails = {
            source:"yt",
            title: yt_info[0].title,
            url: yt_info[0].url,
            thumbnail: yt_info[0]?.thumbnails[((yt_info[0]?.thumbnails?.length||1)-1)||0]?.url||"https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg",
        };

        let SongplayerInfo = {
            source:"yt",
            type: "single",
            videoDetails:videoDetails,
        };
        return SongplayerInfo;
    } catch (error) {
        throw new Error(error || "Error occured");
    };
};