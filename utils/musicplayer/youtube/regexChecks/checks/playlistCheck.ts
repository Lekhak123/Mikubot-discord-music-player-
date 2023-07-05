const matchYoutubePlaylist = async(text : string) : Promise<boolean> => {
    let ytPlaylistRegex = /https?:\/\/(www.)?youtube.com\/playlist\?list=[a-zA-Z0-9-_]+/gmi;
    return ytPlaylistRegex.test(text);
};

export {matchYoutubePlaylist};