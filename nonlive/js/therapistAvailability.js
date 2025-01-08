const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let date = new Date(), 
	currYear = date.getFullYear(), 
	currMonth = date.getMonth(); 
	
let selectedDate = null;

document.addEventListener('DOMContentLoaded', function () {
    const currentDate = document.querySelector(".current-date");
    const daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span");

    const startTimeSelect = document.getElementById("startTimeSelect");
    const endTimeSelect = document.getElementById("endTimeSelect");
    const setAvailabilityButton = document.getElementById("setAvailabilityButton");

    // Initial rendering of the calendar
    renderCalendar(currentDate, daysTag);

    // Event listeners for the prev/next icons
    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
            if (currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            }
            renderCalendar(currentDate, daysTag);
        });
    });

    // Listener for timeSelect dropdown
    daysTag.addEventListener('change', function() {
        if (document.querySelector(".days li.selected")) {
            startTimeSelect.disabled = false; // Enable the start time selector
        }
    });

    startTimeSelect.addEventListener('change', function() {
        if (startTimeSelect.value) {
            endTimeSelect.disabled = false; // Enable the end time selector
            populateEndTimeOptions(startTimeSelect.value);
        } else {
            endTimeSelect.disabled = true; // Disable if no start time is selected
        }
    });

    endTimeSelect.addEventListener('change', function() {
        
    });

    setAvailabilityButton.addEventListener('click', function() {
        const selectedDays = document.querySelectorAll(".days li.selected");
        const selectedDates = Array.from(selectedDays).map(selectedDay => {
            const dayValue = selectedDay.textContent;
            return `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(dayValue).padStart(2, '0')}`;
        });

        const startTime = startTimeSelect.value;
        const endTime = endTimeSelect.value;

        if (selectedDates.length && startTime && endTime) {
            const availableDates = setAvailabilityForSelectedDates(selectedDates, startTime, endTime);
            displayAvailability(availableDates);
            alert("Appointments created for selected dates.");
        } else {
            alert("Please select dates and times before creating appointments.");
        }
    });
});

function renderCalendar(currentDate, daysTag) {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    
    let liTag = "";
    // Previous month's last days
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    // Current month's days
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = (i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear()) ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }
    // Next month's first days
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
    
    // Adding event listeners to day elements
    const dayElements = document.querySelectorAll(".days li:not(.inactive)");
    dayElements.forEach(day => {
        day.addEventListener("click", function () {
            // Toggle selected class on click
            this.classList.toggle("selected");

            // Get all selected days
            const selectedDays = document.querySelectorAll(".days li.selected");
            const selectedDates = Array.from(selectedDays).map(selectedDay => {
                const dayValue = selectedDay.textContent;
                return `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(dayValue).padStart(2, '0')}`;
            });

            // Update a hidden input or any other element to hold the selected dates
            document.getElementById("selectedDates").value = selectedDates.join(", ");
        });
    });
}

function populateEndTimeOptions(startTime) {
    const endTimeSelect = document.getElementById("endTimeSelect");
    const startHour = parseInt(startTime.split(":")[0]);
    const startAMPM = startTime.split(" ")[1]; 

    
    endTimeSelect.innerHTML = `<option value="">--Select End Time--</option>`;

    
    for (let i = 9; i <= 17; i++) { 
        const hour = i > 12 ? i - 12 : i; 
        const ampm = i < 12 ? 'AM' : 'PM';
        const formattedTime = `${hour}:00 ${ampm}`;
        
        
        const currentHourIn24 = (startAMPM === 'PM' && startHour < 12) ? startHour + 12 : startHour;
        const endHourIn24 = (ampm === 'PM' && hour < 12) ? hour + 12 : hour;

        
        if (endHourIn24 > currentHourIn24) {
            endTimeSelect.innerHTML += `<option value="${formattedTime}">${formattedTime}</option>`;
        }
    }
}

function Availability(date, startTime, endTime) {
    this.date = date;         
    this.startTime = startTime; 
    this.endTime = endTime;
}

function setAvailabilityForSelectedDates(selectedDates, startTime, endTime) {
    const availableDates = [];

    selectedDates.forEach(date => {
        const availabilitySet = new Availability(date, startTime, endTime);
        availableDates.push(availabilitySet); 
    });

    return availableDates; 
}

function displayAvailability(availableDates) {
    const availabilityList = document.getElementById("availabilityList");
    availabilityList.innerHTML = ''; // Clear previous listings

    availableDates.forEach(availability => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `Date: ${availability.date}, Start Time: ${availability.startTime}, End Time: ${availability.endTime}`;
        availabilityList.appendChild(listItem);
    });
}