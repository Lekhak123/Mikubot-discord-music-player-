const finalInvalidURLcheck = async(text : string) : Promise<boolean> => {
    let finalInvalidURLcheckRegex = /^(ftp|http|https):\/\/(?:www\.)?[^ "]+$/gmi;
    return finalInvalidURLcheckRegex.test(text);
};

export {finalInvalidURLcheck};