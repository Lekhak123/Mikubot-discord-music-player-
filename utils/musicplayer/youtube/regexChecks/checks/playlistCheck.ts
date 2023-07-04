const matchYoutubePlaylist = async(text : string) : Promise<boolean> => {
    let ytPlaylistRegex = /https?:\/\/(www.)?youtube.com\/playlist\?list=[A-Z0-9-_]+/gmi;
    return ytPlaylistRegex.test(text);
};

export {matchYoutubePlaylist};