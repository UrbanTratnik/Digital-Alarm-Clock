let alarmTime = null;
let alarmInterval;
let alarmAudio;
alarmAudio = new Audio('alarmSound.mp3');
let snoozeTriggered = false; // Flag to track if snooze was triggered

const alarmButton = document.querySelector('.alarm-button');
const saveButton = document.querySelector('.save-button');
const closeButton = document.querySelector('.cancelModal-button');
const cancelButton = document.querySelector('.cancel-button');

alarmButton.addEventListener('click', openModal);
saveButton.addEventListener('click', saveAlarm);
cancelButton.addEventListener('click', cancelAlarm);
closeButton.addEventListener('click', closeModal);

setInterval(updateHour, 1000);
generateAlarmOptions();


// FUnction that updates every second. It givves the numbers for clock and checks if alarm and clock are the same. If they are it triggers the alarm functions
function updateHour() { 
    const currentDate = new Date();
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');

    const secondCounter = document.querySelector('#seconds');
    const minuteCounter = document.querySelector('#minutes');
    const hourCounter = document.querySelector('#hours');

    secondCounter.innerHTML = seconds;
    minuteCounter.innerHTML = minutes;
    hourCounter.innerHTML = hours;  

    if (alarmTime && parseInt(hours) === alarmTime.hour && parseInt(minutes) === alarmTime.minute) {
        // Play alarm sound
        playAlarmSound();
        showAlarmPopup();
    }
}

function openModal() {
    document.querySelector('.modal').style.display = 'block';
}

function closeModal() {
    document.querySelector('.modal').style.display = 'none';
}

// Generates all the numbers in Alarm setting drop down menu. SO I dont have to write tehm manually in HTML
function generateAlarmOptions() {
    const hourSelection = document.querySelector('#hour');
    const minuteSelection = document.querySelector('#minute');

    for (let i = 0; i < 24; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        hourSelection.append(option);
    }

    for (let i = 0; i < 60; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i.toString().padStart(2, '0');
        minuteSelection.append(option);
    }
}

// Saves the selected hours for an Alarm and displays them on display
function saveAlarm() {
    var selectedHour = document.getElementById('hour').value;
    var selectedMinute = document.getElementById('minute').value;
    
    alarmTime = { hour: parseInt(selectedHour), minute: parseInt(selectedMinute) };
    
    closeModal();

    const alarmDisplay = document.getElementById('alarmTimeDisplay');
    alarmDisplay.textContent = selectedHour.toString().padStart(2, '0') + ':' + selectedMinute.toString().padStart(2, '0');
}


// Cancels the existing alarm
function cancelAlarm() {
    clearInterval(alarmInterval);
    alarmTime = null;
    const alarmDisplay = document.getElementById('alarmTimeDisplay');
    if (alarmDisplay) {
        alarmDisplay.textContent = 'None';
    }
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
    snoozeTriggered = false; // Reset the snooze flag
    const alarmPopup = document.getElementById('alarmPopup');
    if (alarmPopup) {
        alarmPopup.style.display = 'none';
    }
}

function playAlarmSound() {
    if (alarmAudio) {
        alarmAudio.play()
    }
}

function showAlarmPopup() {
    const alarmPopup = document.getElementById('alarmPopup');
    if (alarmPopup) {
        alarmPopup.style.display = 'block';
    }
}

function stopAlarm() {
    const alarmPopup = document.getElementById('alarmPopup');
    if (alarmPopup) {
        alarmPopup.style.display = 'none';
    }
    clearInterval(alarmInterval);
    cancelAlarm();
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }
}


// SNOOZES THE ALARM (+1 ON THE CLOCK)
function snoozeAlarm() {
    if (!snoozeTriggered) { // Check if snooze is already triggered
        const alarmPopup = document.getElementById('alarmPopup');
        if (alarmPopup) {
            alarmPopup.style.display = 'none';
        }
        if (alarmAudio) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
        }
        alarmTime.minute += 1;
        if (alarmTime.minute >= 60) {
            alarmTime.hour += 1;
            alarmTime.minute %= 60;
        }
        if (alarmTime.hour >= 24) {
            alarmTime.hour %= 24;
        }
        const alarmDisplay = document.getElementById('alarmTimeDisplay');
        if (alarmDisplay) {
            alarmDisplay.textContent = alarmTime.hour.toString().padStart(2, '0') + ':' + alarmTime.minute.toString().padStart(2, '0');
        }
        clearInterval(alarmInterval);
        snoozeTriggered = true; // Set snooze triggered flag to true
        setTimeout(() => {
            if (snoozeTriggered) { // Check if snooze is still triggered after timeout
                showAlarmPopup();
            }
        }, 60000); // 1 minute
    }
}
