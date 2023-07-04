const ytdl = require('ytdl-core');

export {searchSingleYTlink};

const searchSingleYTlink = async(singlelinkURL : string) => {
    const youtubecookie = process.env.youtubecookie;
    try {
        let info : any;
        if (youtubecookie) {
            let requestOptions = {
                headers: {
                    cookie: youtubecookie
                }
            };
            const videoId = ytdl.getURLVideoID(singlelinkURL, {requestOptions: requestOptions});
            info = await ytdl.getInfo(videoId, {requestOptions: requestOptions});

        } else {
            const videoId = ytdl.getURLVideoID(singlelinkURL);
            info = await ytdl.getInfo(videoId);
        };
        const videoDetails = {
            source:"yt",
            title: info.videoDetails.title,
            url: info.videoDetails.video_url
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