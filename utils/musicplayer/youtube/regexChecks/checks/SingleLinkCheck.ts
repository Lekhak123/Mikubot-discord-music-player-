const matchYoutubeSingleLink = async(text : string) : Promise<boolean> => {
    let ytsingleLinkRegex = /https?:\/\/(www.)?youtub?e?.(com\/watch\?v=[a-zA-Z0-9-_]+|be\/[a-zA-Z0-9-_]+)/gmi;
    return ytsingleLinkRegex.test(text);
};


export {matchYoutubeSingleLink};