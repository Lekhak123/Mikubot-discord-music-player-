const matchYoutubeSingleLink = (text : string) : boolean => {
    let ytsingleLinkRegex = /https?:\/\/(www.)?youtub?e?.(com\/watch\?v=[A-Z0-9-_]+|be\/[A-Z0-9-_]+)/gmi;
    return ytsingleLinkRegex.test(text);
};


export {matchYoutubeSingleLink};