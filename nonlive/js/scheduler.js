const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let date = new Date(), 
	currYear = date.getFullYear(), 
	currMonth = date.getMonth(); 
	

	
let selectedDate = null;


// Consolidated DOMContentLoaded event listener
// Consolidated DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function () {
    const therapyTypeSelector = document.getElementById("therapyTypeSelector");
    const currentDate = document.querySelector(".current-date");
    const daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span");
    
    // Event listener for therapy type selection
    if (therapyTypeSelector) {
        therapyTypeSelector.addEventListener("change", function () {
            const selectedTherapyType = this.value;
            const appointmentTherapyType = document.getElementById("therapyType");
            if (appointmentTherapyType) {
                appointmentTherapyType.value = selectedTherapyType;
                toggleCalendar();
            }
        });
    }
	
	

    // Initial rendering of the calendar
    renderCalendar(currentDate, daysTag);
    toggleCalendar();

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

    // Event listeners for selecting therapy type and date
    const therapyTypeElement = document.getElementById("therapyType");
    const dateOfAptElement = document.getElementById("dateOfApt");
    const timeOfAptElement = document.getElementById("timeOfApt");
    

    //dateOfAptElement.addEventListener("change", checkAndFetchTherapists);
	//timeOfAptElement.addEventListener("change", checkAndFetchTherapists);
    
    document.getElementById("addAppointment").addEventListener("click", function (event) {
        event.preventDefault(); // Prevent the form from submitting normally
        submitAppointment();
    });
    
    // Listener for timeSelect dropdown
    document.getElementById("timeSelect").addEventListener("change", function() {
        const selectedTime = document.getElementById("timeSelect").value;
        if (selectedTime) {
            document.getElementById("timeOfApt").value = convertTo24HourFormat(selectedTime);
        }
		checkAndFetchTherapists();
    });
	
	timeSelect.addEventListener('change', function() {
	    if (timeSelect.value) {
	        therapistsDropdown.disabled = false; // Enable the therapist dropdown
	    } else {
	        therapistsDropdown.disabled = true; // Disable if no time is selected
	    }
	});

	document.getElementById("therapistsDropdown").addEventListener("change", function() {
	            const selectedTherapistId = this.value; // Get the selected therapist's ID

	            // Update the therapistSelect dropdown in the form to reflect the selected therapist
	            const therapistSelect = document.getElementById("therapistSelect");
	            therapistSelect.value = selectedTherapistId; // Set the form's dropdown value to match the external dropdown
	        });

});


function renderCalendar(currentDate,daysTag) {
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
            const selectedDateElement = document.querySelector(".days li.selected");
            if (selectedDateElement) {
                selectedDateElement.classList.remove("selected");
            }
            this.classList.add("selected");
            const dayValue = this.textContent;
            const formattedDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(dayValue).padStart(2, '0')}`;
            document.getElementById("dateOfApt").value = formattedDate;
			
			const timeSelect = document.getElementById("timeSelect"); 
			timeSelect.disabled = false; 
        });
    });
}

function toggleCalendar() {
    const therapyTypeSelect = document.getElementById('therapyTypeSelector');
    const calendarWrapper = document.querySelector('.calWrapper');
  
    if (therapyTypeSelect.value === "") {
        calendarWrapper.classList.add('disabled');
        calendarWrapper.style.pointerEvents = 'none';
        calendarWrapper.style.opacity = '0.5';
    } else {
        calendarWrapper.classList.remove('disabled');
        calendarWrapper.style.pointerEvents = 'auto';
        calendarWrapper.style.opacity = '1';
    }
}

// Function to fetch therapists based on therapy type and date
function fetchTherapists(therapyType, date, time) {
    
    if (therapyType && date && time) {
        // AJAX call to fetch therapists
        const xhr = new XMLHttpRequest();
        xhr.open("GET", `/api/scheduler/available-therapists?therapyType=${therapyType}&date=${date}&time=${time + ":00"}`, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
				const therapistsDropdown = document.getElementById("therapistsDropdown");
                const therapistSelect = document.getElementById("therapistSelect");
				
                therapistSelect.innerHTML = ""; // Clear previous options
				therapistsDropdown.innerHTML = "";
                
                const therapists = JSON.parse(xhr.responseText); // JSON array of therapists
                if (therapists.length > 0) {
					let therapistsList = "<ul>";
                    therapists.forEach(therapist => {
						
						
                        let option1 = document.createElement("option");
                        option1.value = therapist.personId;
                        option1.textContent = therapist.firstName + " " + therapist.lastName;
                        therapistSelect.appendChild(option1);
						
						
						let option2 = document.createElement("option");
						option2.value = therapist.personId;
						option2.textContent = therapist.firstName + " " + therapist.lastName;
						therapistsDropdown.appendChild(option2);
                    });
					
                } else {
                    therapistSelect.innerHTML = "<option>No therapists available</option>";
					therapistsDropdown.innerHTML = "<option>No therapists available</option>";
                }
            } else {
                alert("Failed to fetch therapists.");
            }
        };
        xhr.send();
    }
}

// Function to handle form submission
function submitAppointment() {
    const therapistId = document.getElementById("therapistSelect").value;
    const date = document.getElementById("dateOfApt").value;
    const time = document.getElementById("timeOfApt").value;
    const therapyType = document.getElementById("therapyType").value;
    const notes = document.getElementById("notes").value;

    // Patient info
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Ensure all fields are filled before submitting
    if (therapistId && date && time && therapyType && firstName && lastName) {
        // Add :00 to time if it is not already in HH:mm:ss format
        const formattedTime = time.length === 5 ? time + ":00" : time;
        // First call to add the patient
        const xhrAddPerson = new XMLHttpRequest();
        xhrAddPerson.open("POST", "/api/scheduler/add-patient", true);
        xhrAddPerson.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhrAddPerson.onload = function () {
            if (xhrAddPerson.status === 200) {
                // Now call to add the appointment
                const xhrAddAppointment = new XMLHttpRequest();
                xhrAddAppointment.open("POST", "/api/scheduler/add-appointment", true);
                xhrAddAppointment.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhrAddAppointment.onload = function () {
                    if (xhrAddAppointment.status === 200) {
                        alert("Appointment successfully added!");
                    } else {
                        alert("Failed to add appointment.");
                    }
                };
                xhrAddAppointment.send(JSON.stringify({ therapistId, date, time: formattedTime, therapyType, notes }));
            } else {
                alert("Failed to add patient.");
            }
        };
        // Send the patient information
        xhrAddPerson.send(JSON.stringify({ firstName, lastName, email, phone }));
    } else {
        alert("Please fill in all the fields.");
    }
}

function convertTo24HourFormat(time) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":");
    
    if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
        hours = "00";
    }
    
    return `${hours}:${minutes}`;
}

function checkAndFetchTherapists() {
    const therapyType = document.getElementById("therapyType").value;
    const aptDate = document.getElementById("dateOfApt").value;
    const time = document.getElementById("timeOfApt").value;

	if (therapyType && aptDate && time) 
		{ fetchTherapists(therapyType, aptDate, time);
    }
    
}




