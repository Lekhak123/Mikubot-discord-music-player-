const ytpl = require('ytpl');
export {searchYTPlaylist};

const searchYTPlaylist = async(playlistUrl : string) => {
    // Fetch playlist details
    let playlist : any;
    try {
        playlist = await ytpl(playlistUrl);
        let playlistdata : Array <any> = [];
        playlist.items.map((x:any)=>{
            playlistdata.push({
                url: x.url,
                title:x.title,
                source: "yt",
                thumbnail: x?.bestThumbnail?.url||"https://images.pexels.com/photos/3648850/pexels-photo-3648850.jpeg",
            });
        })
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