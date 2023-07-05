const spotifyTrackCheck = async(text : string) : Promise<boolean> => {
    let spotifyTrackRegex = /https?:\/\/open.spotify.com\/track\/[a-zA-Z0-9-_]+\?si=[a-zA-Z0-9-_]+/gmi;
    return spotifyTrackRegex.test(text);
};


export {spotifyTrackCheck};