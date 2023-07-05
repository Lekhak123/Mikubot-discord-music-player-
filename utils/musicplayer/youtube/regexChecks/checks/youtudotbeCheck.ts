const matchYoutudotbePlaylist = async(text : string) : Promise<boolean> => {
    let ytPlaylistRegex = /https?:\/\/youtu.be\/playlist\?list=[a-zA-Z0-9-_]+/gmi;
    return ytPlaylistRegex.test(text);
};
export {matchYoutudotbePlaylist};