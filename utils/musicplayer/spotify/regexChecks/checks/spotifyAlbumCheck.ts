const spotifyAlbumCheck = async(text : string) : Promise<boolean> => {
    let spotifyAlbumRegex = /https?:\/\/open.spotify.com\/album\/[A-Z0-9-_]+\?si=[A-Z0-9-_]+/gmi;
    return spotifyAlbumRegex.test(text);
};

export {spotifyAlbumCheck};