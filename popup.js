const applyBtn = document.getElementById("apply-btn")
const startAt = document.getElementById("start-at")
const endAt = document.getElementById("end-at")

chrome.storage.local.get(["time"]).then((result) => {
    if (result.time) {
        const { startAt: startAtValue, endAt: endAtValue } = result.time
        startAt.value = startAtValue
        endAt.value = endAtValue
    }
});

applyBtn.onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const startAtTime = parseTime(startAt.value)
    const endAtTime = parseTime(endAt.value)

    if (!startAt || !endAt) {
        return;
    }

    if (startAt > endAt) {
        invalidTimeOrderError()
        return;
    }

    const time = { startAt: startAtTime, endAt: endAtTime }

    chrome.storage.local.set({ time: { startAt: startAt.value, endAt: endAt.value } }).then(() => { });

    await chrome.tabs.sendMessage(tab.id, time);

}

const parseTime = (time) => {
    if (time.includes(":")) {
        const timeParts = time.split(":")
        if (timeParts.length != 2) {
            invalidFormatError()
            return;
        }

        const [hours, minutes] = timeParts
        if (!isInteger(hours) || !isInteger(minutes)) {
            invalidFormatError()
            return;
        }

        return Number(hours) * 60 + Number(minutes)
    } else if (isInteger(time)) {
        return Number(time)
    } else {
        invalidFormatError()
        return;
    }
}

const isInteger = (str) => {
    str = str.trim()
    if (!str) {
        return false
    }

    str = str.replace(/^0+/, "") || "0";

    const int = Math.floor(Number(str));
    return int !== Infinity && String(int) === str
}

const invalidFormatError = () => {
    alert("Wrong time format, use: HH:mm Ex: 12:10")
}

const invalidTimeOrderError = () => {
    alert("Start at time is greater than end at")
}