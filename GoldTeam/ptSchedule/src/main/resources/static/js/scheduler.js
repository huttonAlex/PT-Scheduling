
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];



class Calendar {
  constructor(config) {
	
	this.container = config.container;
	this.currentDateElement = config.currentDateElement;
	this.daysTag = config.daysTag;
	this.prevIcon = config.prevIcon;
	this.nextIcon = config.nextIcon;
	this.onDateClick = config.onDateClick;
	this.fetchData = config.fetchData;


	
	this.date = new Date();
	this.currYear = this.date.getFullYear();
	this.currMonth = this.date.getMonth();


	
	this.renderCalendar();


	
	this.initializeEventListeners();
  }


  initializeEventListeners() {
	
	this.prevIcon.addEventListener("click", () => {
  	this.currMonth -= 1;
  	if (this.currMonth < 0) {
    	this.currYear -= 1;
    	this.currMonth = 11;
  	}
  	this.renderCalendar();
	});


	this.nextIcon.addEventListener("click", () => {
  	this.currMonth += 1;
  	if (this.currMonth > 11) {
    	this.currYear += 1;
    	this.currMonth = 0;
  	}
  	this.renderCalendar();
	});
  }


  renderCalendar() {
	let firstDayOfMonth = new Date(this.currYear, this.currMonth, 1).getDay();
	let lastDateOfMonth = new Date(this.currYear, this.currMonth + 1, 0).getDate();
	let lastDayOfMonth = new Date(this.currYear, this.currMonth, lastDateOfMonth).getDay();
	let lastDateOfLastMonth = new Date(this.currYear, this.currMonth, 0).getDate();


	let liTag = "";


	
	for (let i = firstDayOfMonth; i > 0; i--) {
  	liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
	}


	
	for (let i = 1; i <= lastDateOfMonth; i++) {
  	let isToday =
    	i === this.date.getDate() &&
    	this.currMonth === this.date.getMonth() &&
    	this.currYear === this.date.getFullYear()
      	? "active"
      	: "";
  	liTag += `<li class="${isToday}">${i}</li>`;
	}


	
	for (let i = lastDayOfMonth; i < 6; i++) {
  	liTag += `<li class="inactive">${i - lastDayOfMonth + 1}</li>`;
	}


	this.currentDateElement.innerText = `${months[this.currMonth]} ${this.currYear}`;
	this.daysTag.innerHTML = liTag;


	
	const dayElements = this.daysTag.querySelectorAll("li:not(.inactive)");
	dayElements.forEach((day) => {
  	day.addEventListener("click", () => {
    	
    	const selectedDateElement = this.daysTag.querySelector("li.selected");
    	if (selectedDateElement) {
      	selectedDateElement.classList.remove("selected");
    	}
    	day.classList.add("selected");


    	const dayValue = day.textContent;
    	const formattedDate = `${this.currYear}-${String(this.currMonth + 1).padStart(2, '0')}-${String(dayValue).padStart(2, '0')}`;


    	
    	if (typeof this.onDateClick === "function") {
      	this.onDateClick(formattedDate);
    	}
  	});
	});


	 
	if (typeof this.fetchData === "function") {
  	this.fetchData(this.currYear, this.currMonth + 1);
	}
  }


  markAppointments(dates) {
	dates.forEach((dateString) => {
  	const appointmentDate = new Date(dateString);
  	if (
    	appointmentDate.getFullYear() === this.currYear &&
    	appointmentDate.getMonth() === this.currMonth
  	) {
    	const day = appointmentDate.getDate();
    	const dayElements = this.daysTag.querySelectorAll("li:not(.inactive)");
    	const dayElement = Array.from(dayElements).find(
      	(el) => parseInt(el.textContent) === day
    	);
    	if (dayElement) {
      	dayElement.classList.add("has-appointment");
    	}
  	}
	});
  }
}



let selectedDate = null;
let isDateChanged = false;
let isTimeChanged = false;
let originalDate, originalTime, originalTherapist;


const headerTitle = document.getElementById("headerTitle");
const selectorsContainer = document.getElementById("selectorsContainer");
const modifyContainer = document.getElementById("modifyContainer");
const appointmentOverviewContainer = document.getElementById("appointmentOverviewContainer");
const ratingPageContainer = document.getElementById("ratingPageContainer");
const modifyTherapySelector = document.getElementById("modifyTherapySelector");
const modifyDateElement = document.getElementById("findDateArea");
const modifyTimeElement = document.getElementById("findTimeArea");
const therapyTypeSelector = document.getElementById("therapyTypeSelector");
const timeSelect = document.getElementById("timeSelect");
const therapistsDropdown = document.getElementById("therapistsDropdown");
const modifyTherapistsDropdown = document.getElementById("modifyTherapistsDropdown");
const appointmentForm = document.getElementById("appointmentForm");
const appointmentReturnContainer = document.getElementById("appointmentReturnContainer");
const appointmentSelectContainer = document.getElementById('appointmentSelectContainer');
const customAlert = document.getElementById("customAlert");
const customAlertMessage = document.getElementById("customAlertMessage");
const findFirstNameInput = document.getElementById("findFirstName");
const findLastNameInput = document.getElementById("findLastName");
const findEmailInput = document.getElementById("findEmail");
const findPhoneInput = document.getElementById("findPhone");
const appointmentsContainer = document.getElementById("appointmentsContainer");



let mainCalendarInstance, overviewCalendarInstance; 


document.addEventListener("DOMContentLoaded", function () {
  initializeCalendars();
  initializeEventListeners();
  toggleCalendar();
});


function initializeCalendars() {
  
  mainCalendarInstance = new Calendar({
	container: document.getElementById("scheduleCalendar"),
	currentDateElement: document.querySelector("#scheduleCalendar .current-date"),
	daysTag: document.querySelector("#scheduleCalendar .days"),
	prevIcon: document.getElementById("mainPrev"),
	nextIcon: document.getElementById("mainNext"),
	onDateClick: function (formattedDate) {
  	document.getElementById("dateOfApt").value = formattedDate;
  	timeSelect.disabled = false;
	},
	fetchData: null, 
  });


 
  overviewCalendarInstance = new Calendar({
	container: document.getElementById("overviewCalendar"),
	currentDateElement: document.querySelector("#overviewCalendar .current-date"),
	daysTag: document.querySelector("#overviewCalendar .overviewDays"),
	prevIcon: document.getElementById("overviewPrev"),
	nextIcon: document.getElementById("overviewNext"),
	onDateClick: function (formattedDate) {
  	fetchAppointmentsForDate(formattedDate);
	},
	fetchData: function (year, month) {
  	fetchAppointmentsForMonth(year, month);
	},
  });

}


function initializeEventListeners() {
  
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


  
  if (modifyTherapySelector) {
	modifyTherapySelector.addEventListener("change", function () {
  	isDateChanged = false;
  	isTimeChanged = false;
	});
  }


  
  if (modifyDateElement) {
	modifyDateElement.addEventListener("change", function () {
  	isDateChanged = true;
  	checkAndFetchTherapistsModify();
	});
  }


  if (modifyTimeElement) {
	modifyTimeElement.addEventListener("change", function () {
  	isTimeChanged = true;
  	checkAndFetchTherapistsModify();
	});
  }


  
  if (timeSelect) {
	timeSelect.addEventListener("change", function () {
  	const selectedTime = this.value;
  	if (selectedTime) {
    	document.getElementById("timeOfApt").value = convertTo24HourFormat(selectedTime);
    	checkAndFetchTherapists();
  	}
	});
  }


  
  if (therapistsDropdown) {
	therapistsDropdown.addEventListener("change", function () {
  	const selectedTherapistId = this.value;
  	
	});
  }


  
  document.getElementById("addAppointment").addEventListener("click", function (event) {
	event.preventDefault(); 
	submitAppointment();
  });


  
  document.getElementById("scheduleAppointment").addEventListener("click", function () {
	scheduleAppointment();
  });



  document.getElementById("modifyAppointment").addEventListener("click", function () {
	resetModifyTab();
	switchToModify();
  });



  document.getElementById("editAppointment").addEventListener("click", function () {
	modifyAppointment();
	clearReturnFormAndSelections();
  });



  document.getElementById("cancelAppointment").addEventListener("click", function () {
	cancelAppointment();
  });



  document.getElementById("viewAppointments").addEventListener("click", function () {
	appointmentOverview();
  });
  

  document.getElementById("ratingsPageView").addEventListener("click", function () {
	viewRatingPage();
  })



  document.getElementById('findAppointment').addEventListener('click', function () {
	findAppointment();
  });
  

  if (modifyTherapySelector) {
	modifyTherapySelector.addEventListener("change", function () {
		isTherapyTypeChanged = true;
		checkAndFetchTherapistsModify();
	});
  }
}





function toggleCalendar() {
  const therapyTypeSelect = document.getElementById('therapyTypeSelector');
  const calendarWrapper = document.querySelector('#scheduleCalendar');
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


function fetchTherapists(therapyType, date, time) {
  if (therapyType && date && time) {
	fetch(`/api/scheduler/available-therapists?therapyType=${therapyType}&date=${date}&time=${time}:00`)
  	.then(response => response.json())
  	.then(therapists => {
    	therapistsDropdown.innerHTML = "";
    	if (therapists.length > 0) {
      	therapists.forEach(therapist => {
        	let option = document.createElement("option");
        	option.value = therapist.personId;
        	option.textContent = `${therapist.firstName} ${therapist.lastName}`;
        	therapistsDropdown.appendChild(option);
      	});
      	therapistsDropdown.disabled = false;
    	} else {
      	therapistsDropdown.innerHTML = "<option>No therapists available</option>";
      	therapistsDropdown.disabled = true;
    	}
  	})
  	.catch(error => {
    	showCustomAlert("Failed to fetch therapists.");
  	});
  }
}


function fetchTherapistsModify(therapyType, date, time, isOriginalTime, originalTherapist) {
  if (therapyType && date && time) {

	fetch(`/api/scheduler/available-therapists?therapyType=${therapyType}&date=${date}&time=${time}`)
  	.then(response => {
		console.log(response)
		if (!response.ok) {
			throw new Error(`Server error: ${response.status}`);
		} 
		
		return response.json();
		
	})
  	.then(therapists => {
    	modifyTherapistsDropdown.innerHTML = "";
    	let therapistAdded = false;


    	therapists.forEach(therapist => {
				console.log("therapist: " + therapist.firstName);
	      	let option = document.createElement("option");
	      	option.value = therapist.personId;
	      	option.textContent = `${therapist.firstName} ${therapist.lastName}`;
	      	if (therapist.personId === originalTherapist.id) {
	        	therapistAdded = true;
	        		if (isOriginalTime) {
	          			option.selected = true;
	        		}
      	}
      	modifyTherapistsDropdown.appendChild(option);
    	});


    	
    	if (isOriginalTime && originalTherapist && !therapistAdded) {
      	const currentTherapistOption = document.createElement("option");
      	currentTherapistOption.value = originalTherapist.id;
      	currentTherapistOption.textContent = originalTherapist.name;
      	currentTherapistOption.selected = true;
      	modifyTherapistsDropdown.appendChild(currentTherapistOption);
    	}
  	})
  	.catch(error => {
		console.error("Error in fetchTherapistsModify", error);
    	showCustomAlert("Failed to fetch therapists.");
  	});
  }
}


function submitAppointment() {
  const therapistId = therapistsDropdown.value;
  const date = document.getElementById("dateOfApt").value;
  const time = document.getElementById("timeOfApt").value;
  const therapyType = document.getElementById("therapyType").value;
  const notes = document.getElementById("notes").value;
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();


  let missingFields = [];
  if (!therapistId) missingFields.push("Therapist");
  if (!date) missingFields.push("Date");
  if (!time) missingFields.push("Time");
  if (!therapyType) missingFields.push("Therapy Type");
  if (!firstName) missingFields.push("First Name");
  if (!lastName) missingFields.push("Last Name");
  if (!email) missingFields.push("Email");
  if (!phone) missingFields.push("Phone");


  if (missingFields.length === 0) {
	const formattedTime = time.length === 5 ? time + ":00" : time;
	
	fetch("/api/scheduler/add-patient", {
  	method: "POST",
  	headers: {
    	"Content-Type": "application/json"
  	},
  	body: JSON.stringify({ firstName, lastName, email, phone })
	})
  	.then(response => {
    	if (response.ok) {
      	
      	fetch("/api/scheduler/add-appointment", {
        	method: "POST",
        	headers: {
          	"Content-Type": "application/json"
        	},
        	body: JSON.stringify({ therapistId, date, time: formattedTime, therapyType, notes })
      	})
        	.then(response => {
          	if (response.ok) {
            	showCustomAlert("Appointment successfully added!");
            	resetForm();
          	} else {
            	showCustomAlert("Failed to add appointment.");
          	}
        	})
        	.catch(error => {
          	showCustomAlert("Failed to add appointment.");
        	});
    	} else {
      	showCustomAlert("Failed to add patient.");
    	}
  	})
  	.catch(error => {
    	showCustomAlert("Failed to add patient.");
  	});
  } else {
	showCustomAlert("Please fill in the following required fields: " + missingFields.join(", "));
  }
}


function resetForm() {
  appointmentForm.reset();
  therapistsDropdown.innerHTML = "<option>Select Therapist</option>";
  therapistsDropdown.disabled = true;
  timeSelect.value = "";
  timeSelect.disabled = true;
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
  if (therapyType && aptDate && time) {
	fetchTherapists(therapyType, aptDate, time);
  }
}


function checkAndFetchTherapistsModify() {
  const therapyType = modifyTherapySelector.value || originalTherapyType;
  const aptDate = modifyDateElement.value || originalDate;
  const time = modifyTimeElement.value.slice(0, 5) || originalTime;


  const isOriginalTime = aptDate === originalDate && time === originalTime;


  fetchTherapistsModify(therapyType, aptDate, time, isOriginalTime, originalTherapist);
}


function switchToModify() {
  if (headerTitle) {
	headerTitle.textContent = "Find Appointment";
  }
  selectorsContainer.style.display = 'none';
  modifyContainer.style.display = 'flex';
  document.getElementById("formContainer").style.display = "block";
  appointmentReturnContainer.style.display = "none";
}


function modifyAppointment() {
  const appointmentId = document.getElementById("findAppointmentId").value;
  const newDate = modifyDateElement.value || originalDate;
  const newTime = modifyTimeElement.value ? modifyTimeElement.value.slice(0, 5) : originalTime;
  const newNotes = document.getElementById("findNotesArea").value;
  const newTherapistId = modifyTherapistsDropdown.value || originalTherapist.id;
  const newTherapyType = modifyTherapySelector.value || originalTherapyType;



  const patientFirstName = document.getElementById("firstNameArea").value || originalFirstName;
  const patientLastName = document.getElementById("lastNameArea").value || originalLastName;
  const patientEmail = document.getElementById("emailArea").value || originalEmail;
  const patientPhone = document.getElementById("phoneArea").value || originalPhone;


  console.log(appointmentId, newDate, newTime, newTherapistId, newTherapyType);


  if (appointmentId && newDate && newTime && newTherapistId && newTherapyType) {

	const data = {
  	appointmentId,
  	newDate,
  	newTime,
  	newType: newTherapyType,
  	newTherapistId,
  	notes: newNotes,
  	originalPatientFirstName: originalFirstName,
  	originalPatientLastName: originalLastName,
  	originalPatientEmail: originalEmail,
  	originalPatientPhone: originalPhone,
  	newPatientFirstName: patientFirstName,
  	newPatientLastName: patientLastName,
  	newPatientEmail: patientEmail,
  	newPatientPhone: patientPhone
	};


	fetch(`/api/scheduler/modify-appointment`, {
  	method: "POST",
  	headers: {
    	"Content-Type": "application/json"
  	},
  	body: JSON.stringify(data)
	})
  	.then(response => {
    	if (response.ok) {
      	showCustomAlert("Appointment and patient information modified successfully.");
      	clearReturnFormAndSelections();
    	} else {
      	showCustomAlert("Failed to modify appointment or patient information.");
    	}
  	})
  	.catch(error => {
    	showCustomAlert("Failed to modify appointment or patient information.");
  	});
  } else {
	showCustomAlert("Please fill in all the required fields.");
  }
}


function scheduleAppointment() {
  if (headerTitle) {
	headerTitle.textContent = "Schedule an Appointment";
  }
  if (selectorsContainer && modifyContainer) {
	selectorsContainer.style.display = 'flex';
	modifyContainer.style.display = 'none';
	appointmentOverviewContainer.style.display = 'none';
	ratingPageContainer.style.display = 'none';
  }
}


function findAppointment() {
  const findFirstName = findFirstNameInput.value.trim() || "";
  const findLastName = findLastNameInput.value.trim() || "";
  const findEmail = findEmailInput.value.trim() || "";
  const findPhone = findPhoneInput.value.trim() || "";


  if (findFirstName || findLastName || findEmail || findPhone) {
	fetch(`/api/scheduler/find-appointments?firstName=${encodeURIComponent(findFirstName)}&lastName=${encodeURIComponent(findLastName)}&email=${encodeURIComponent(findEmail)}&phone=${encodeURIComponent(findPhone)}`)
  	.then(response => response.json())
  	.then(appointments => {
    	if (appointments.length > 0) {
      	getAppointmentList(appointments);
    	} else {
      	showCustomAlert("No appointments found for the given details.");
    	}
  	})
  	.catch(error => {
    	showCustomAlert("Failed to retrieve appointments.");
  	});


	appointmentsContainer.style.display = 'block';
  } else {
	showCustomAlert("Please fill in at least one field.");
  }
}


function getAppointmentList(appointments) {
  appointmentSelectContainer.innerHTML = ''; 
  appointments.forEach(appointment => {
	const appointmentDiv = document.createElement('div');


	
	appointmentDiv.textContent = `Date: ${appointment.scheduleDay}, Time: ${appointment.startTime}`;


	
	appointmentDiv.style.margin = '10px';
	appointmentDiv.style.padding = '10px';
	appointmentDiv.style.border = '1px solid #ccc';
	appointmentDiv.style.backgroundColor = '#f9f9f9';
	appointmentDiv.style.cursor = 'pointer';


	appointmentDiv.addEventListener('click', function () {
  	returnAppointment(appointment);
	});


	
	appointmentSelectContainer.appendChild(appointmentDiv);
  });
}


function returnAppointment(appointment) {
  document.getElementById("findAppointmentId").value = appointment.appointmentId;
  document.getElementById("firstNameArea").value = appointment.firstName;
  document.getElementById("lastNameArea").value = appointment.lastName;
  document.getElementById("emailArea").value = appointment.email;
  modifyDateElement.value = appointment.scheduleDay;
  modifyTimeElement.value = appointment.startTime;
  document.getElementById("findNotesArea").value = appointment.notes;
  document.getElementById("findScheduledTherapist").textContent = appointment.therapistFullName;
  document.getElementById("phoneArea").value = appointment.phone;
  modifyTherapySelector.value = appointment.therapyType;
  appointmentReturnContainer.style.display = 'flex';


  
  originalDate = appointment.scheduleDay;
  originalTime = appointment.startTime;
  originalTherapist = {
	id: appointment.therapistId,
	name: appointment.therapistFullName
  };
  originalTherapyType = appointment.therapyType;
  originalNotes = appointment.notes;
  
  
  originalFirstName = appointment.firstName;
  originalLastName = appointment.lastName;
  originalEmail = appointment.email;
  originalPhone = appointment.phone;

  checkAndFetchTherapistsModify();
}


function cancelAppointment() {
  const appointmentId = document.getElementById("findAppointmentId").value;
  if (appointmentId) {
	fetch(`/api/scheduler/cancel-appointment?appointmentId=${appointmentId}`, {
  	method: "DELETE"
	})
  	.then(response => {
    	if (response.ok) {
      	showCustomAlert("Appointment canceled successfully.");
      	clearReturnFormAndSelections();
    	} else {
      	showCustomAlert("Failed to cancel appointment.");
    	}
  	})
  	.catch(error => {
    	showCustomAlert("Failed to cancel appointment.");
  	});
  } else {
	showCustomAlert("Please select an appointment to cancel.");
  }
}


function showCustomAlert(message) {
  customAlertMessage.textContent = message;
  customAlert.style.display = "block";
}


function closeCustomAlert() {
  customAlert.style.display = "none";
}


function clearReturnFormAndSelections() {
  
  document.getElementById("findAppointmentId").value = "";
  document.getElementById("firstNameArea").value = "";
  document.getElementById("lastNameArea").value = "";
  document.getElementById("emailArea").value = "";
  document.getElementById("findScheduledTherapist").textContent = "";
  if (modifyTherapySelector) {
	modifyTherapySelector.value = "";
  }
  if (modifyDateElement) {
	modifyDateElement.value = "";
  }
  if (modifyTimeElement) {
	modifyTimeElement.value = "";
  }
  document.getElementById("findNotesArea").value = "";
  
  appointmentReturnContainer.style.display = "none";
  
  appointmentSelectContainer.innerHTML = "";
}


function resetModifyTab() {
  clearReturnFormAndSelections();
  appointmentOverviewContainer.style.display = 'none';
  ratingPageContainer.style.display = 'none';
  modifyContainer.style.display = 'flex';
  selectorsContainer.style.display = 'none';
}


function appointmentOverview() {
	if (headerTitle) {
	        headerTitle.textContent = "View Appointments"; 
	    }
  appointmentOverviewContainer.style.display = 'flex';
  ratingPageContainer.style.display = 'none';
  modifyContainer.style.display = 'none';
  selectorsContainer.style.display = 'none';
}

function viewRatingPage(){
	if (headerTitle) {
	        headerTitle.textContent = "Rate Therapists"; 
	    }
	ratingPageContainer.style.display = 'block';
	appointmentOverviewContainer.style.display = 'none';
	modifyContainer.style.display = 'none';
	selectorsContainer.style.display = 'none';
	}



function fetchAppointmentsForMonth(year, month) {
  
  fetch(`/api/scheduler/appointments-by-month?year=${year}&month=${month}`)
	.then(response => response.json())
	.then(appointments => {
  	
  	const appointmentDates = [...new Set(appointments.map(a => a.scheduleDay))];
  	overviewCalendarInstance.markAppointments(appointmentDates);
	})
	.catch(error => {
  	console.error("Failed to fetch appointments for the month.", error);
	});
}