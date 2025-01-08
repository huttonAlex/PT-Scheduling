const overviewMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let overviewDate = new Date(),
    overviewCurrYear = overviewDate.getFullYear(),
    overviewCurrMonth = overviewDate.getMonth();

let selectedOverviewDate;
let returnedAppointments = [];
let overviewLastDate;
let overviewFirstDate;

let overviewCurrentDate;
let overviewDaysTag;

let selectedAppointment = null;



document.addEventListener('DOMContentLoaded', function () {
	
	overviewCurrentDate = document.querySelector("#overviewCalendar .current-date");
	    overviewDaysTag = document.querySelector("#overviewCalendar .overviewDays");
	    const overviewPrevNextIcon = document.querySelectorAll("#overviewCalendar .icons span");
  

    renderOverviewCalendar(overviewCurrentDate, overviewDaysTag);
	fetchAppointmentsForMonth(overviewCurrYear, overviewCurrMonth + 1);

    overviewPrevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            overviewCurrMonth = icon.id === "overviewPrev" ? overviewCurrMonth - 1 : overviewCurrMonth + 1;
            if (overviewCurrMonth < 0 || overviewCurrMonth > 11) {
                overviewDate = new Date(overviewCurrYear, overviewCurrMonth, new Date().getDate());
                overviewCurrYear = overviewDate.getFullYear();
                overviewCurrMonth = overviewDate.getMonth();
            }
            renderOverviewCalendar(overviewCurrentDate, overviewDaysTag);
			fetchAppointmentsForMonth(overviewCurrYear, overviewCurrMonth + 1);
        });
    });

    document.getElementById("scheduleAppointment").addEventListener("click", function () {
        scheduleAppointment();
    });

    document.getElementById("sendToModifyButton").addEventListener("click", function () {
        if (selectedAppointment) {
            
            console.log("Modifying Appointment:", selectedAppointment);
            overviewReturnAppointment (selectedAppointment);
			overviewModifyAppointment();
			
			document.dispatchEvent(new Event('modifyTabOpened'));
			
        } else {
            console.error("No appointment selected.");
        }
    });
});

function renderOverviewCalendar(overviewCurrentDate, overviewDaysTag) {
    let firstOvDateofMonth = new Date(overviewCurrYear, overviewCurrMonth, 1).getDate(),
        firstOvDayofMonth = new Date(overviewCurrYear, overviewCurrMonth, 1).getDay(),
        lastOvDateofMonth = new Date(overviewCurrYear, overviewCurrMonth + 1, 0).getDate(),
        lastOvDayofMonth = new Date(overviewCurrYear, overviewCurrMonth, lastOvDateofMonth).getDay(),
        lastOvDateofLastMonth = new Date(overviewCurrYear, overviewCurrMonth, 0).getDate();

    

    const formattedOvFirstDate = `${overviewCurrYear}-${String(overviewCurrMonth + 1).padStart(2, '0')}-${String(firstOvDateofMonth).padStart(2, '0')}`;
    const formattedOvLastDate = `${overviewCurrYear}-${String(overviewCurrMonth + 1).padStart(2, '0')}-${String(lastOvDateofMonth).padStart(2, '0')}`;

    overviewFirstDate = formattedOvFirstDate;
    overviewLastDate = formattedOvLastDate;

    overviewCurrentDate.innerText = `${overviewMonths[overviewCurrMonth]} ${overviewCurrYear}`;
    overviewDaysTag.innerHTML = ""; 



   
    for (let i = firstOvDayofMonth; i > 0; i--) {
        const inactiveDay = document.createElement("li");
        inactiveDay.className = "inactive";
        inactiveDay.textContent = lastOvDateofLastMonth - i + 1;
        overviewDaysTag.appendChild(inactiveDay);
    }

    
    for (let i = 1; i <= lastOvDateofMonth; i++) {
        const currentDay = document.createElement("li");
        currentDay.textContent = i;
        
        
        const formattedDate = `${overviewCurrYear}-${String(overviewCurrMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const hasAppointment = returnedAppointments.some(app => app.scheduleDay === formattedDate);
		const appointmentsForDay = returnedAppointments.filter(app => app.scheduleDay === formattedDate);
		
        if (hasAppointment) {
            currentDay.classList.add("appointment-day"); 
            
            
            currentDay.addEventListener("click", function () {
                displayAppointmentsForDate(formattedDate, appointmentsForDay);
            });
        }

        
        if (i === overviewDate.getDate() && overviewCurrMonth === new Date().getMonth() && overviewCurrYear === new Date().getFullYear()) {
            currentDay.classList.add("active");
        }

        overviewDaysTag.appendChild(currentDay);
    }

    
    for (let i = lastOvDayofMonth; i < 6; i++) {
        const inactiveNextDay = document.createElement("li");
        inactiveNextDay.className = "inactive";
        inactiveNextDay.textContent = i - lastOvDayofMonth + 1;
        overviewDaysTag.appendChild(inactiveNextDay);
    }

    
}


function fetchAppointmentsForMonth(year, month) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", `/api/scheduler/appointments-by-month?year=${year}&month=${month}`,true);

	xhr.onload = function () {
		if (xhr.status === 200) {
			const appointments = JSON.parse(xhr.responseText);
			returnedAppointments = appointments;
			displayAppointmentsForMonth(appointments);
			renderOverviewCalendar(overviewCurrentDate, overviewDaysTag);
		} else {
			console.error("Failed to fetch appointments for the month.");
			
		}
	};
	
	xhr.send();
}

function displayAppointmentsForMonth(appointments) {
	const overviewReturnContainer = document.getElementById("overviewReturnContainer");
	overviewReturnContainer.innerHTML = "<h2>Appointments</h2>";

	const groupedAppointmentsByDay = appointments.reduce((groups, app) => {
    	const appointmentDate = app.scheduleDay; 
    	if (!groups[appointmentDate]) {
        	groups[appointmentDate] = [];
    	}
    	groups[appointmentDate].push(app);
    	return groups;
	}, {});



	overviewDaysTag.innerHTML = ""; 
	for (let i = 1; i <= new Date(overviewCurrYear, overviewCurrMonth + 1, 0).getDate(); i++) {
    	const currentDay = document.createElement("li");
    	currentDay.textContent = i;

    	const formattedDate = `${overviewCurrYear}-${String(overviewCurrMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    	
    	if (groupedAppointmentsByDay[formattedDate]) {
        	currentDay.classList.add("appointment-day");


        	currentDay.addEventListener("click", function () {
            	displayAppointmentsForDate(formattedDate, groupedAppointmentsByDay[formattedDate]);
        	});
    	}


    	if (i === overviewDate.getDate() && overviewCurrMonth === new Date().getMonth() && overviewCurrYear === new Date().getFullYear()) {
        	currentDay.classList.add("active");
    	}


    	overviewDaysTag.appendChild(currentDay);
	}
}
	

function displayAppointmentsForDate(date, appointments) {
    const overviewReturnContainer = document.getElementById("overviewReturnContainer");
    const overviewInfoContainer = document.getElementById("overviewInfoContainer");
    overviewReturnContainer.style.display = "block";
    overviewInfoContainer.style.display = "none";  
    overviewReturnContainer.innerHTML = "<h2>Appointments</h2>";

    appointments.forEach(app => {
        const appointmentDiv = document.createElement("div");
        appointmentDiv.classList.add("returnAppointmentsSelector");
        appointmentDiv.classList.add("appointmentDiv");

        
        const startTime = convertTo12HourFormat(app.startTime);
        const endTime = convertTo12HourFormat(app.endTime);

        appointmentDiv.innerHTML = `
            <p><strong>Therapist:</strong> ${app.therapistFullName}</p>
            <p><strong>Therapy Type:</strong> ${app.therapyType}</p>
            <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        `;

       
        appointmentDiv.addEventListener("click", () => {
            displayAppointmentDetails(app);
        });

        overviewReturnContainer.appendChild(appointmentDiv);
    });
}

function displayAppointmentDetails(app) {
    const overviewInfoContainer = document.getElementById("overviewInfoContainer");
    const appointmentDetails = document.getElementById("appointmentDetails");

    
    const startTime = convertTo12HourFormat(app.startTime);
    const endTime = convertTo12HourFormat(app.endTime);

    
    appointmentDetails.innerHTML = `
        <p><strong>Patient Name:</strong> ${app.patientName}</p>
        <p><strong>Email:</strong> ${app.email}</p>
		<p><strong>Phone:</strong> ${app.phone}</p>
        <p><strong>Therapist:</strong> ${app.therapistFullName}</p>
        <p><strong>Therapy Type:</strong> ${app.therapyType}</p>
        <p><strong>Date:</strong> ${app.scheduleDay}</p>
        <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
        <p><strong>Notes:</strong> ${app.notes || "No notes"}</p>
    `;

    selectedAppointment = app;
    selectedOverviewDate = app.scheduleDay;
    overviewInfoContainer.style.display = "block";
}


function selectAppointment(OverviewAppointment) {
    
    document.querySelectorAll(".returnAppointmentsSelector").forEach(div => {
        div.classList.remove("selected"); 
    });
    
    event.currentTarget.classList.add("selected"); 
    
    
    console.log("Selected appointment:", OverviewAppointment); 
}


function overviewModifyAppointment() {
    const headerTitle = document.getElementById("headerTitle");
    const selectorsContainer = document.getElementById("selectorsContainer");
    const modifyContainer = document.getElementById("modifyContainer");
    const appointmentReturnContainer = document.getElementById("appointmentReturnContainer");
    const appointmentOverviewContainer = document.getElementById("appointmentOverviewContainer");
    const ratingPageContainer = document.getElementById("ratingPageContainer");



    if (headerTitle) {
        headerTitle.textContent = "Modify Appointment";
    }



    selectorsContainer.style.display = 'none';
    modifyContainer.style.display = 'flex';
    formContainer.style.display = 'none';
    appointmentReturnContainer.style.display = 'flex';
    appointmentOverviewContainer.style.display = 'none';
    ratingPageContainer.style.display = 'none';
}




function overviewReturnAppointment(OverviewAppointment) {
    console.log("Populating fields with:", OverviewAppointment);

    document.getElementById("firstNameArea").value = OverviewAppointment.firstName || "";
    document.getElementById("lastNameArea").value = OverviewAppointment.lastName || "";
    document.getElementById("emailArea").value = OverviewAppointment.email || "";
    document.getElementById("findScheduledTherapist").textContent = OverviewAppointment.therapistFullName || "";
    document.getElementById("modifyTherapySelector").value = OverviewAppointment.therapyType || "";
    document.getElementById("findDateArea").value = OverviewAppointment.scheduleDay || "";
    document.getElementById("findTimeArea").value = OverviewAppointment.startTime || "";
    document.getElementById("findNotesArea").value = OverviewAppointment.notes || "";
	document.getElementById("phoneArea").value = OverviewAppointment.phone;
	
	document.getElementById("findAppointmentId").value = OverviewAppointment.appointmentId;
		
	originalDate = OverviewAppointment.scheduleDay;
	originalTime = OverviewAppointment.startTime;
	originalTherapist = {
		id: OverviewAppointment.therapistId,
		name: OverviewAppointment.therapistFullName
	};
	originalTherapyType = OverviewAppointment.therapyType;
	

    document.getElementById("appointmentReturnContainer").style.display = 'flex';
	
	checkAndFetchTherapistsModify(originalTherapyType, originalDate, originalTime, true, originalTherapist)
}


function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hour = parseInt(hours);

    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    } else if (hour === 0) {
        hour = 12;
    }

    return `${hour}:${minutes} ${period}`;
}
