const spotifyTrackCheck = async(text : string) : Promise<boolean> => {
    let spotifyTrackRegex = /https?:\/\/open.spotify.com\/track\/[A-Z0-9-_]+\?si=[A-Z0-9-_]+/gmi;
    return spotifyTrackRegex.test(text);
};


export {spotifyTrackCheck};