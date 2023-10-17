"use strict";
window.onload = function () {
    buildCalendar();
    // 오늘 날짜의 데이터를 선택
    const todayCell = document.querySelector(".today");
    if (todayCell) {
        choiceDate(todayCell);
    }
};
let nowMonth = new Date();
let today = new Date();
let dateData = [];
today.setHours(0, 0, 0, 0);
function buildCalendar() {
    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);
    let tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("caly").innerText = nowMonth.getFullYear();
    document.getElementById("calm").innerText = leftPad(nowMonth.getMonth() + 1);
    while (tbody_Calendar.rows.length > 0) {
        tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }
    let nowRow = tbody_Calendar.insertRow();
    let currentDayOfWeek = firstDate.getDay();

    for (let j = 0; j < currentDayOfWeek; j++) {
        let nowColumn = nowRow.insertCell();
    }
    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {
        let nowColumn = nowRow.insertCell();
        let newDIV = document.createElement("p");
        newDIV.innerHTML = leftPad(nowDay.getDate());
        nowColumn.appendChild(newDIV);

        if (nowDay.getDay() == 0) {
            nowColumn.style.color = "#DC143C";
        } else if (nowDay.getDay() == 6) {
            nowColumn.style.color = "#0000CD";
            nowRow = tbody_Calendar.insertRow();
        }
        if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()
        ) {
            newDIV.className = "today";
            newDIV.onclick = function () {
                choiceDate(this);
            };
        } else {
            newDIV.className = "futureDay";
            newDIV.onclick = function () {
                choiceDate(this);
            };
        }
    }
}
function initDateData() {
    let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
    let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);

    dateData = [];

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {
        dateData.push({
            date: new Date(nowDay),
            items: [],
            memo: ""
        });
    }
}
initDateData();
function choiceDate(newDIV) {
    if (document.getElementsByClassName("choiceDay")[0]) {
        document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");
    }
    newDIV.classList.add("choiceDay");
    
    // 선택한 날짜에 대한 데이터 가져오기
    const selectedDate = dateData.find(dateObj => dateObj.date.getDate() === parseInt(newDIV.textContent));
    
    // 리스트 업데이트
    const itemList = document.getElementById("study-list");
    itemList.innerHTML = "";
    selectedDate.items.forEach(itemObj => {
        const newItem = document.createElement("li");
        newItem.className = "list-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = itemObj.checked; // 체크 상태 복원
        const itemText = document.createElement("span");
        itemText.textContent = itemObj.text;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-button";
        deleteButton.onclick = function () {
            // 아이템 삭제
            const index = selectedDate.items.indexOf(itemObj);
            if (index !== -1) {
                selectedDate.items.splice(index, 1);
                updateMemoText(selectedDate);
            }
            choiceDate(newDIV); // 선택한 날짜 다시 업데이트
        };
        checkbox.addEventListener("change", function () {
            itemObj.checked = checkbox.checked; // 체크 상태 저장
            updateMemoText(selectedDate);
        });
        newItem.appendChild(checkbox);
        newItem.appendChild(itemText);
        newItem.appendChild(deleteButton);
        itemList.appendChild(newItem);
    });
    
    // 메모 업데이트
    const memoText = document.getElementById("memo-text");
    memoText.value = selectedDate.memo;
    
    // 메모 저장 함수 호출
    updateMemoText(selectedDate);
}
// 메모 텍스트 업데이트 함수
function updateMemoText(selectedDate) {
    const memoText = document.getElementById("memo-text");
    memoText.value = selectedDate.memo;
    // 메모 자동 저장
    selectedDate.memo = memoText.value;
}
function prevCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());
    buildCalendar();
}
function nextCalendar() {
    nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());
    buildCalendar();
}
function leftPad(value) {
    if (value < 10) {
        value = "0" + value;
        return value;
    }
    return value;
}
const newItemInput = document.getElementById("new-item");
newItemInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addItem();
    }
});
function addItem() {
    const newItemInput = document.getElementById("new-item");
    const newItemText = newItemInput.value.trim();
    if (newItemText !== "") {
        const itemList = document.getElementById("study-list");
        const newItem = document.createElement("li");
        newItem.className = "list-item";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const itemText = document.createElement("span");
        itemText.textContent = newItemText;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-button";
        deleteButton.onclick = function () {
            itemList.removeChild(newItem);

            // 선택한 날짜를 찾습니다.
            const selectedDate = dateData.find(dateObj => dateObj.date.getDate() === parseInt(document.querySelector(".choiceDay").textContent));

            // 삭제할 항목을 찾습니다.
            const itemObj = selectedDate.items.find(item => item.text === newItemText);
            
            if (itemObj) {
                // 선택한 날짜의 항목에서 항목을 제거합니다.
                const index = selectedDate.items.indexOf(itemObj);
                if (index !== -1) {
                    selectedDate.items.splice(index, 1);
                    updateMemoText(selectedDate);
                }
            }
            choiceDate(document.querySelector(".choiceDay")); // 선택한 날짜를 업데이트합니다.
        };
        checkbox.addEventListener("change", function () {
            const selectedDate = dateData.find(dateObj => dateObj.date.getDate() === parseInt(document.querySelector(".choiceDay").textContent));
            const itemObj = selectedDate.items.find(item => item.text === newItemText);
            if (itemObj) {
                itemObj.checked = checkbox.checked; // 체크 상태를 저장합니다.
                updateMemoText(selectedDate);
            }
        });
        newItem.appendChild(checkbox);
        newItem.appendChild(itemText);
        newItem.appendChild(deleteButton);
        itemList.appendChild(newItem);

        // 현재 선택한 날짜를 찾아서 새 항목을 그 날짜의 항목에 추가합니다.
        const selectedDate = dateData.find(dateObj => dateObj.date.getDate() === parseInt(document.querySelector(".choiceDay").textContent));
        selectedDate.items.push({ text: newItemText, checked: false });
        updateMemoText(selectedDate);

        newItemInput.value = "";
    }
}
const memoText = document.getElementById("memo-text");
memoText.addEventListener("input", function () {
    const selectedDate = dateData.find(dateObj => dateObj.date.getDate() === parseInt(document.querySelector(".choiceDay").textContent));
    selectedDate.memo = memoText.value;
});