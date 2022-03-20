import { useDebugValue } from "react";

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

// progess bar course
export const progessBar = (listVideo, actor) => {
    // console.log(listVideo, actor);
    let unlocked = 0
    listVideo.forEach(video => {
        if (video.unlock.includes(actor)) {
            unlocked++
        }
    })
    const res = unlocked / listVideo.length
    return (
        <div className="progress">
            <div
                className="progress-bar progress-bar-striped progress-bar-animated"
                role="progressbar"
                style={{width: `${res*100}%`}}
                aria-valuenow={{width: `${res*100}`}}
                aria-valuemin="0"
                aria-valuemax="100"
            ></div>
        </div>
    )
}