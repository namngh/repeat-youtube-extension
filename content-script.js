let video = document.querySelector(".html5-video-container video")

const repeat = (startAt, endAt) => {
    video.currentTime = startAt

    video.ontimeupdate = (e) => {
        if (e.type == "timeupdate" && e.target.currentTime >= endAt) {
            video.currentTime = startAt
        }
    }
}

chrome.runtime.onMessage.addListener(
    (request, _, sendResponse) => {
        sendResponse({ success: true });
        repeat(request.startAt, request.endAt)

        return true
    }
);