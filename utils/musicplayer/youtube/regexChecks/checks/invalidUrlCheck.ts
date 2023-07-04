const finalInvalidURLcheck = (text : string) : boolean => {
    let finalInvalidURLcheckRegex = /^(ftp|http|https):\/\/(?:www\.)?[^ "]+$/gmi;
    return finalInvalidURLcheckRegex.test(text);
};

export {finalInvalidURLcheck};