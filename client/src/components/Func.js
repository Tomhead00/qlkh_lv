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

// slugify everythings
export const slugify = (string) => {
    const a = 'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;'
    const b = 'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return string.toString().toLowerCase()
        .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
        .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
        .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
        .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
        .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
        .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
        .replace(/đ/gi, 'd')
        .replace(/\s+/g, '-') 
        .replace(p, c => b.charAt(a.indexOf(c)))
        .replace(/&/g, '-and-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}

// check have video
export const getAllVideo = (course) => {
    var videos = []
    course.sections.map((section) => {
        section.videos.map((video) => {
            videos = [...videos, video]
        })
    })
    return videos
}