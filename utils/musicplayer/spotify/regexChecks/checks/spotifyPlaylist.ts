const spotifyPlaylistCheck = async(text : string) : Promise<boolean> => {
    let spotifyPlaylistRegex = /https?:\/\/open.spotify.com\/playlist\/[A-Z0-9-_]+\?si=[A-Z0-9-_]+/gmi;
    return spotifyPlaylistRegex.test(text);
};

export {spotifyPlaylistCheck};