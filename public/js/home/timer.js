"use strict";
let timer;
let isRunning = false;
let startTime;
let endTime;
let recordedTimes = [];
let seconds = 0;
let minutes = 0;
let hours = 0;

function startStop() {
    if (isRunning) {
        clearInterval(timer);
        document.getElementById("startStop").textContent = "시작";
        endTime = new Date();
        document.getElementById("endTime").textContent = "종료: " + formatTime(endTime.getHours()) + ":" + formatTime(endTime.getMinutes()) + ":" + formatTime(endTime.getSeconds());
        recordTime();
    } else {
        startTime = new Date();
        document.getElementById("startTime").textContent = "시작: " + formatTime(startTime.getHours()) + ":" + formatTime(startTime.getMinutes()) + ":" + formatTime(startTime.getSeconds());
        timer = setInterval(updateTime, 1000);
        document.getElementById("startStop").textContent = "중지";
    }
    isRunning = !isRunning;
}
function updateTime() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }
    const display = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    document.getElementById("display").textContent = display;
}
function recordTime() {
    if (isRunning) {
        const currentTime = new Date();
        const elapsedTime = currentTime - startTime;
        const elapsedHours = Math.floor(elapsedTime / 3600000);
        const elapsedMinutes = Math.floor((elapsedTime % 3600000) / 60000);
        const elapsedSeconds = Math.floor((elapsedTime % 60000) / 1000);
        const recordedTimeObj = {
            startTime: startTime,
            endTime: currentTime,
            elapsed: {
                hours: elapsedHours,
                minutes: elapsedMinutes,
                seconds: elapsedSeconds
            }
        };
        recordedTimes.unshift(recordedTimeObj);
        if (recordedTimes.length > 5) {
            recordedTimes.pop();
        }
        const recordList = document.getElementById("recordList");
        recordList.innerHTML = "";
        for (let i = 0; i < recordedTimes.length; i++) {
            const recordedTimeObj = recordedTimes[i];
            const listItem = document.createElement("li");

            if (i === 0) {
                listItem.style.color = "#4f3976";
            } else {
                listItem.style.color = "#b19bd7";
            }
            listItem.innerHTML = formatTime(recordedTimeObj.startTime.getHours()) + ":" + formatTime(recordedTimeObj.startTime.getMinutes()) +"<span class='time-separator'> &nbsp; </span>" +
            formatTime(recordedTimeObj.endTime.getHours()) + ":" + formatTime(recordedTimeObj.endTime.getMinutes()) +"<span class='time-separator'> &nbsp; </span>" +
            formatTime(recordedTimeObj.elapsed.hours) + ":" + formatTime(recordedTimeObj.elapsed.minutes) + ":" + formatTime(recordedTimeObj.elapsed.seconds);
            recordList.appendChild(listItem);
        }
    }
}
function reset() {
    clearInterval(timer);
    isRunning = false;
    seconds = 0;
    minutes = 0;
    hours = 0;
    recordedTimes = [];
    document.getElementById("display").textContent = "00:00:00";
    document.getElementById("startTime").textContent = "시작: ";
    document.getElementById("endTime").textContent = "종료: ";
    document.getElementById("recordList").innerHTML = "";
    document.getElementById("startStop").textContent = "시작";
}
function formatTime(time) {
    return String(time).padStart(2, "0");
}