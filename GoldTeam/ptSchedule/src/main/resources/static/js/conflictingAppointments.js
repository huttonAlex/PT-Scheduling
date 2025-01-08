
const conMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let conDate = new Date(),
    conCurrYear = conDate.getFullYear(),
    conCurrMonth = conDate.getMonth();

let selectedConDate = null;
let conCurrentDay;
let conDaysTag;
let conLastDate;
let conFirstDate;
let conflictingAppointments = [];

/*function ConflictingAppointment(ConPatientFirstName,ConPatientLastName, ConPatientEmail,ConTherapist,ConTherapyType, ConAptDate, ConAptStartTime, ConAptEndTime, ConAptNotes) {
    this.ConPatientFirstName = ConPatientFirstName;
    this.ConPatientLastName = ConPatientLastName;
    this.ConPatientEmail = ConPatientEmail;
    this.ConTherapist = ConTherapist;
    this.ConTherapyType = ConTherapyType;
    this.ConAptDate = ConAptDate;
    this.ConAptStartTime = ConAptStartTime;
    this.ConAptEndTime = ConAptEndTime;
    this.ConAptNotes= ConAptNotes;
}

let newConflictingAppointment1 = new ConflictingAppointment('Kanye','West','kanye@west.com','Aeisha Riggs','Exercise Therapy','2024-11-01','10:00','11:00','Its ye.');
let newConflictingAppointment2 = new ConflictingAppointment('Ken','Carson','ken@carson.com','April Calhoun','Pelvic','2024-11-09','11:00','12:00','My shirt Balenciaga.');
let newConflictingAppointment3 = new ConflictingAppointment('Peter','Griffin','peter@email.com','Carmen Cohen','Rehabilitative','2024-11-25','09:00','10:00','This dude is fat.');
let newConflictingAppointment4 = new ConflictingAppointment('Joe','Swanson','joe@email.com','Art Holt','Taping','2024-11-17','08:00','09:00','Joe got no legs.');
let newConflictingAppointment5 = new ConflictingAppointment('Denzel','Curry','denzel@email.com','Abraham Burton','Massage','2024-11-30','12:00','13:00','He hurt himself walkin.');
let newConflictingAppointment6 = new ConflictingAppointment('Vince','Staples','vince@email.com','Aeisha Riggs','Exercise Therapy','2024-11-01','12:00','13:00','You gotta bring his burner back.');
let newConflictingAppointment7 = new ConflictingAppointment('Ken','Carson','ken@carson.com','April Calhoun','Exercise Therapy','2024-11-01','11:00','12:00','My shirt Balenciaga.');
let newConflictingAppointment8 = new ConflictingAppointment('Joe','Swanson','joe@email.com','April Calhoun','Exercise Therapy','2024-11-01','12:00','13:00','Joe got no legs.');
let newConflictingAppointment9 = new ConflictingAppointment('Peter','Griffin','peter@email.com','April Calhoun','Exercise Therapy','2024-11-01','08:00','09:00','This dude is fat.');
let newConflictingAppointment10 = new ConflictingAppointment('Denzel','Curry','denzel@email.com','April Calhoun','Exercise Therapy','2024-12-07','08:00','09:00','He hurt himself walkin.');

let conflictingAppointments = [newConflictingAppointment1,newConflictingAppointment2,
    newConflictingAppointment3,newConflictingAppointment4,
    newConflictingAppointment5,newConflictingAppointment6,
    newConflictingAppointment7,newConflictingAppointment8,
    newConflictingAppointment9,newConflictingAppointment10
]
*/

let selectedConAppointment = null;

document.addEventListener('DOMContentLoaded', function () {

    conCurrentDate = document.querySelector("#conflictCalendar .current-date");
    conDaysTag = document.querySelector("#conflictCalendar .conDays");
    const conPrevNextIcon = document.querySelectorAll("#conflictCalendar .icons span");

    renderConflictCalendar(conCurrentDate, conDaysTag);
	fetchConflictingAppointmentsForMonth(conCurrYear, conCurrMonth +1);

    conPrevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            conCurrMonth = icon.id === "conPrev" ? conCurrMonth - 1 : conCurrMonth + 1;
            if (conCurrMonth < 0 || conCurrMonth > 11) {
                conDate = new Date(conCurrYear, conCurrMonth, new Date().getDate());
                conCurrYear = conDate.getFullYear();
                conCurrMonth = conDate.getMonth();
            }
            renderConflictCalendar(conCurrentDate, conDaysTag);
			fetchConflictingAppointmentsForMonth(conCurrYear, conCurrMonth +1);
        });
    });

    document.getElementById("scheduleAppointment").addEventListener("click", function () {
        scheduleAppointment();
    });

	document.getElementById("sendToModifyButtonConflicts").addEventListener("click", function () {
	        if (selectedConAppointment) {
	            //overviewModifyAppointment();
	            console.log("Modifying Appointment:", selectedConAppointment); // Debug log before populating form
				conflictReturnAppointment (selectedConAppointment); // Populate form fields with selected appointment data
	            conflictModifyAppointment();
				
				document.dispatchEvent(new Event('modifyTabOpened'));
	        } else {
	            console.error("No appointment selected.");
	        }
	    });

/*
    document.getElementById("viewAppointments").addEventListener("click", function () {
        appointmentOverview();
    });

    document.getElementById("conflictAppointmentView").addEventListener("click", function () {
        viewConflictingApts();
    });*/

});

function renderConflictCalendar(conCurrentDate, conDaysTag) {
    let firstConDateofMonth = new Date(conCurrYear, conCurrMonth, 1).getDate(),
        firstConDayofMonth = new Date(conCurrYear, conCurrMonth, 1).getDay(),
        lastConDateofMonth = new Date(conCurrYear, conCurrMonth + 1, 0).getDate(),
        lastConDayofMonth = new Date(conCurrYear, conCurrMonth, lastConDateofMonth).getDay(),
        lastConDateofLastMonth = new Date(conCurrYear, conCurrMonth, 0).getDate();

    // Update the calendar month and year display

    const formattedConFirstDate = `${conCurrYear}-${String(conCurrMonth + 1).padStart(2, '0')}-${String(firstConDateofMonth).padStart(2, '0')}`;
    const formattedConLastDate = `${conCurrYear}-${String(conCurrMonth + 1).padStart(2, '0')}-${String(lastConDateofMonth).padStart(2, '0')}`;

    conFirstDate = formattedConFirstDate;
    conLastDate = formattedConLastDate;

    conCurrentDate.innerText = `${conMonths[conCurrMonth]} ${conCurrYear}`;
    conDaysTag.innerHTML = ""; // Clear previous days



    // Build the days for the previous month
    for (let i = firstConDayofMonth; i > 0; i--) {
        const inactiveConDay = document.createElement("li");
        inactiveConDay.className = "conInactive";
        inactiveConDay.textContent = lastConDateofLastMonth - i + 1;
        conDaysTag.appendChild(inactiveConDay);
    }

    // Build the days for the current month
    for (let i = 1; i <= lastConDateofMonth; i++) {
        currentConDay = document.createElement("li");
        currentConDay.textContent = i;
        
        // Check if the current day has a matching appointment
        const formattedConDate = `${conCurrYear}-${String(conCurrMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasConAppointment = conflictingAppointments.some(conApp => conApp.scheduleDay === formattedConDate);
		const conAppointmentsForDay = conflictingAppointments.filter(conApp => conApp.scheduleDay === formattedConDate);
		
        if (hasConAppointment) {
            currentConDay.classList.add("conAppointment-day"); // Add a class to mark the day
            
            // Add a click event to display appointments for this date
            currentConDay.addEventListener("click", function () {
                displayConAppointmentsForDate(formattedConDate, conAppointmentsForDay);
            });
        }

        // Optionally highlight today's date
        if (i === conDate.getDate() && conCurrMonth === new Date().getMonth() && conCurrYear === new Date().getFullYear()) {
            currentConDay.classList.add("active");
        }

        conDaysTag.appendChild(currentConDay);
    }

    // Build the days for the next month
    for (let i = lastConDayofMonth; i < 6; i++) {
        const inactiveNextConDay = document.createElement("li");
        inactiveNextConDay.className = "conInactive";
        inactiveNextConDay.textContent = i - lastConDayofMonth + 1;
        conDaysTag.appendChild(inactiveNextConDay);
    }

    updateDateDisplay3(conFirstDate,conLastDate);
}

function fetchConflictingAppointmentsForMonth(year, month) {
	//fetch(`/api/scheduler/conflicting-appointments-by-month?year=${year}&month=${month}`)
		const xhr = new XMLHttpRequest();
		xhr.open("GET", `/api/scheduler/conflicting-appointments-by-month?year=${year}&month=${month}`,true);

		xhr.onload = function () {
			if (xhr.status === 200) {
				const appointments = JSON.parse(xhr.responseText); //Array of appts
				conflictingAppointments = appointments;
				displayConflictingAppointmentsForMonth(appointments);
				renderConflictCalendar(currentConDay, conDaysTag);
			} else {
				console.error("Failed to fetch conflicting appointments for the month.");
				
			}
		};
		
		xhr.send();
	}
	
// Function to display appointments for the current month
function displayConflictingAppointmentsForMonth(appointments) {
	const conflictReturnContainer = document.getElementById("conflictReturnContainer");
	conflictReturnContainer.innerHTML = "<h2>Appointments</h2>";


	// Group the appointments by day
	const groupedAppointmentsByDay = appointments.reduce((groups, app) => {
    	const appointmentDate = app.scheduleDay; 
    	if (!groups[appointmentDate]) {
        	groups[appointmentDate] = [];
    	}
    	groups[appointmentDate].push(app);
    	return groups;
	}, {});


	// Loop through all days of the current month to check if any appointment matches the day
	conDaysTag.innerHTML = ""; // Clear previous days to avoid duplication
	for (let i = 1; i <= new Date(conCurrYear, conCurrMonth + 1, 0).getDate(); i++) {
    	const currentDay = document.createElement("li");
    	currentDay.textContent = i;

    	const formattedDate = `${conCurrYear}-${String(conCurrMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    	// Check if there are any appointments on this day
    	if (groupedAppointmentsByDay[formattedDate]) {
        	currentDay.classList.add("appointment-day"); // Add class to visually indicate appointments on this day


        	// Add a click event to display appointments for this day
        	currentDay.addEventListener("click", function () {
            	displayConflictingAppointmentsForDate(formattedDate, groupedAppointmentsByDay[formattedDate]);
        	});
    	}


    	// Optionally highlight today's date
    	if (i === conDate.getDate() && conCurrMonth === new Date().getMonth() && conCurrYear === new Date().getFullYear()) {
        	currentDay.classList.add("active");
    	}


    	// Append the day to the calendar days tag
    	conDaysTag.appendChild(currentDay);
	}
}

// Function to display appointments for a specific date
function displayConAppointmentsForDate(date, appointments) {
    const conReturnContainer = document.getElementById("conflictReturnContainer");
    const conInfoContainer = document.getElementById("conInfoContainer");
    conReturnContainer.style.display = "block";
    conInfoContainer.style.display = "none";  // Initially hidden

    conReturnContainer.innerHTML = "<h2>Appointments</h2>";
    //const appointmentsForConDate = conflictingAppointments.filter(conApp => conApp.ConAptDate === formattedConDate);

	appointments.forEach(app => {
	    	const appointmentDiv = document.createElement("div");
	    	appointmentDiv.classList.add("conAppointmentsSelector");
	    	appointmentDiv.innerHTML = `
	        	<p><strong>Therapist:</strong> ${app.therapistFullName}</p>
	        	<p><strong>Therapy Type:</strong> ${app.therapyType}</p>
	        	<p><strong>Time:</strong> ${app.startTime} - ${app.endTime}</p>
	    	`;


	    	// Add a click event to display full details of this appointment
	    	appointmentDiv.addEventListener("click", () => {
	        	displayConAppointmentDetails(app);
	    	});


	    	conReturnContainer.appendChild(appointmentDiv);
		});
		}

function displayConAppointmentDetails(conApp) {
    const conInfoContainer = document.getElementById("conInfoContainer");
    const conAppointmentDetails = document.getElementById("conAppointmentDetails");

    // Display details using `ReturnAppointment` properties
    conAppointmentDetails.innerHTML = `
        <p><strong>Patient Name:</strong> ${conApp.patientName}</p>
        <p><strong>Email:</strong> ${conApp.email}</p>
        <p><strong>Therapist:</strong> ${conApp.therapistFullName}</p>
        <p><strong>Therapy Type:</strong> ${conApp.therapyType}</p>
        <p><strong>Date:</strong> ${conApp.scheduleDay}</p>
        <p><strong>Time:</strong> ${conApp.startTime} - ${conApp.endTime}</p>
        <p><strong>Notes:</strong> ${conApp.notes || "No notes"}</p>
    `;
    
    selectedConAppointment = conApp;
	selectedConDate = conApp.scheduleDay;
    conInfoContainer.style.display = "block";
}

// Function to handle the selection of an appointment
function selectConAppointment(ConAppointment) {
    // Highlight the selected appointment
    document.querySelectorAll(".returnConAppointmentsSelector").forEach(div => {
        div.classList.remove("selected"); // Remove previous selections
    });
    
    event.currentTarget.classList.add("selected"); // Add 'selected' to clicked appointment div
    
    // Further actions for the selected appointment (like displaying details)
    console.log("Selected appointment:", ConAppointment); // Adjust this for your specific needs
}


function scheduleAppointment() {

    if (headerTitle) {
        headerTitle.textContent = "Schedule an Appointment"; 
    }

    if (selectorsContainer && modifyContainer) {
        selectorsContainer.style.display = 'flex';
        modifyContainer.style.display = 'none';
        appointmentConflictContainer.style.display = 'none';
    }

}

function appointmentOverview() {

    headerTitle.textContent = "Appointment Overview";
    
    appointmentOverviewContainer.style.display = 'flex';
    modifyContainer.style.display = 'none';
    selectorsContainer.style.display = 'none';
    appointmentConflictContainer.style.display = 'none';
}

function conflictModifyAppointment() {
    const headerTitle = document.getElementById("headerTitle");
    const selectorsContainer = document.getElementById("selectorsContainer");
    const modifyContainer = document.getElementById("modifyContainer");
    const appointmentReturnContainer = document.getElementById("appointmentReturnContainer");
    const appointmentOverviewContainer = document.getElementById("appointmentOverviewContainer");
    const appointmentConflictContainer = document.getElementById("appointmentConflictContainer");


    // Update the header title
    if (headerTitle) {
        headerTitle.textContent = "Modify Appointment";
    }


    // Show modifyContainer and appointmentReturnContainer, hide others
    selectorsContainer.style.display = 'none';
    modifyContainer.style.display = 'flex';
    formContainer.style.display = 'none';
    appointmentReturnContainer.style.display = 'flex';
    appointmentOverviewContainer.style.display = 'none';
    appointmentConflictContainer.style.display = 'none'; // Hide the appointment conflict container
}

function conflictReturnAppointment(ConAppointment) {
    console.log("Populating fields with:", ConAppointment); // Debugging log


    // Populate form fields directly with properties of `appointment`
	document.getElementById("firstNameArea").value = ConAppointment.firstName || "";
	document.getElementById("lastNameArea").value = ConAppointment.lastName || "";
	document.getElementById("emailArea").value = ConAppointment.email || "";
	document.getElementById("findScheduledTherapist").textContent = ConAppointment.therapistFullName || "";
	document.getElementById("modifyTherapySelector").value = ConAppointment.therapyType || "";
	document.getElementById("findDateArea").value = ConAppointment.scheduleDay || "";
	document.getElementById("findTimeArea").value = ConAppointment.startTime || "";
	document.getElementById("findNotesArea").value = ConAppointment.notes || "";
	
	document.getElementById("findAppointmentId").value = ConAppointment.appointmentId;
	
	originalDate = ConAppointment.scheduleDay;
	originalTime = ConAppointment.startTime;
	originalTherapist = {
		id: ConAppointment.therapistId,
		name: ConAppointment.therapistFullName
	};
	originalTherapyType = ConAppointment.therapyType;

    // Ensure the container shows up if it's hidden
    document.getElementById("appointmentReturnContainer").style.display = 'flex';
}


function updateDateDisplay3(conFirstDate,conLastDate) {
    const dateDisplayDiv2 = document.getElementById("dateDisplay3");
    
    dateDisplayDiv2.textContent = `First Date: ${conFirstDate}, Last Date: ${conLastDate}`;
}



