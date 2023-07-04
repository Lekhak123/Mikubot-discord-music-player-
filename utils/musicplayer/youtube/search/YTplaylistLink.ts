const ytpl = require('ytpl');
export {searchYTPlaylist};

const searchYTPlaylist = async(playlistUrl : string) => {
    // Fetch playlist details
    let playlist : any;
    try {
        console.log(playlistUrl)
        playlist = await ytpl(playlistUrl);
        let playlistdata : Array <any> = [];
        playlist.items.map((x:any)=>{
            playlistdata.push({
                url: x.url,
                title:x.title,
                source: "yt"
            });
        })
        let SongplayerInfo = {
            source: "yt",
            type: "multiple",
            videoDetails: playlistdata
        };
        return SongplayerInfo;
    } catch (error) {
        console.log(error)
        throw new Error(error || "Error occured");
    };
};