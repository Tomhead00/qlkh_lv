export const isValidHttpUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    return true
}

export const youtube_parser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    var match = url.match(regExp);
    return (match&&match[7].length===11)? match[7] : false;
}

    // check have video
export const isEmpty = (obj) => {
    if(typeof(obj) !== 'object') {
        return true
    } else
    return Object.keys(obj).length === 0;
}