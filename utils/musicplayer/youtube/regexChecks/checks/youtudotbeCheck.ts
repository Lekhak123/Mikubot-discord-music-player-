const matchYoutudotbePlaylist = async(text : string) : Promise<boolean> => {
    let ytPlaylistRegex = /https?:\/\/youtu.be\/playlist\?list=[A-Z0-9-_]+/gmi;
    return ytPlaylistRegex.test(text);
};
export {matchYoutudotbePlaylist};