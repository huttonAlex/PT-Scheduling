const overviewMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let overviewDate = new Date(),
    overviewCurrYear = overviewDate.getFullYear(),
    overviewCurrMonth = overviewDate.getMonth();

let selectedOverviewDate = null;
let returnedAppointments = [];
let overviewLastDate;
let overviewFirstDate;

let selectedAppointment = null;
let overViewCurrentDate;
let overviewDaysTag;

document.addEventListener('DOMContentLoaded', function () {

    overviewCurrentDate = document.querySelector("#overviewCalendar .current-date");
    overviewDaysTag = document.querySelector("#overviewCalendar .overviewDays");
    const overviewPrevNextIcon = document.querySelectorAll("#overviewCalendar .icons span");
	
	fetchAppointmentsForMonth(overviewCurrYear, overviewCurrMonth);
   	   renderOverviewCalendar(overviewCurrentDate, overviewDaysTag);

    overviewPrevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            overviewCurrMonth = icon.id === "overviewPrev" ? overviewCurrMonth - 1 : overviewCurrMonth + 1;
            if (overviewCurrMonth < 0 || overviewCurrMonth > 11) {
                overviewDate = new Date(overviewCurrYear, overviewCurrMonth, new Date().getDate());
                overviewCurrYear = overviewDate.getFullYear();
                overviewCurrMonth = overviewDate.getMonth();
            }
			fetchAppointmentsForMonth(overviewCurrYear, overviewCurrMonth);
            	renderOverviewCalendar(overviewCurrentDate, overviewDaysTag);
        });
    });

    

    document.getElementById("viewAppointments").addEventListener("click", function () {
        appointmentOverview();
    });

    
});

function renderOverviewCalendar() {
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
        const hasAppointment = returnedAppointments.some(app => app.date === formattedDate);

        if (hasAppointment) {
            currentDay.classList.add("appointment-day"); 
            
            
            currentDay.addEventListener("click", function () {
                displayAppointmentsForDate(formattedDate);
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


function displayAppointmentsForDate(date) {
    const overviewReturnContainer = document.getElementById("overviewReturnContainer");
    const overviewInfoContainer = document.getElementById("overviewInfoContainer");
    overviewReturnContainer.style.display = "block";
    overviewInfoContainer.style.display = "none";

    overviewReturnContainer.innerHTML = "<h2>Appointments</h2>";
    const appointmentsForDate = returnedAppointments.filter(app => app.date === date);

    const groupedAppointments = appointmentsForDate.reduce((groups, app) => {
        groups[app.therapistId] = groups[app.therapistId] || [];
        groups[app.therapistId].push(app);
        return groups;
    }, {});

    for (const [therapist, OverviewAppointment] of Object.entries(groupedAppointments)) {
        const therapistDiv = document.createElement("div");
        therapistDiv.classList.add("therapist-group");

        OverviewAppointment.forEach(app => {
            const appointmentDiv = document.createElement("div");
            appointmentDiv.classList.add("returnAppointmentsSelector");
			
			const startTime = convertTo12HourFormat(app.startTime);
			const endTime = convertTo12HourFormat(app.endTime);
			
            appointmentDiv.innerHTML = `
                <p><strong>Therapy Type:</strong> ${app.therapyType}</p>
                <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
            `;

            
            appointmentDiv.addEventListener("click", () => {
                displayAppointmentDetails(app);
            });

            therapistDiv.appendChild(appointmentDiv);
        });

        overviewReturnContainer.appendChild(therapistDiv);
    }
}

function displayAppointmentDetails(app) {
    const overviewInfoContainer = document.getElementById("overviewInfoContainer");
    const appointmentDetails = document.getElementById("appointmentDetails");
	
	const startTime = convertTo12HourFormat(app.startTime);

    
    appointmentDetails.innerHTML = `
        <p><strong>Patient Name:</strong> ${app.patientFirstName} ${app.patientLastName}</p>
        <p><strong>Therapist:</strong> ${app.therapistFullName}</p>
        <p><strong>Therapy Type:</strong> ${app.therapyType}</p>
        <p><strong>Date:</strong> ${app.date}</p>
        <p><strong>Time:</strong> ${startTime}</p>
        <p><strong>Notes:</strong> ${app.notes || "No notes"}</p>
    `;
    
    selectedAppointment = app;
    overviewInfoContainer.style.display = "block";
}


function selectAppointment(OverviewAppointment) {
    
    document.querySelectorAll(".returnAppointmentsSelector").forEach(div => {
        div.classList.remove("selected"); 
    });
    
    event.currentTarget.classList.add("selected"); 
    
    
    console.log("Selected appointment:", OverviewAppointment); 
}





function appointmentOverview() {

    headerTitle.textContent = "Appointment Overview";
    
    appointmentOverviewContainer.style.display = 'flex';
    modifyAvailContainer.style.display = 'none';
    defaultAvailContainer.style.display = 'none'; 
    
}



function overviewReturnAppointment(OverviewAppointment) {
    console.log("Populating fields with:", OverviewAppointment); 

    
    document.getElementById("firstNameArea").value = OverviewAppointment.PatientFirstName || "";
    document.getElementById("lastNameArea").value = OverviewAppointment.PatientLastName || "";
    document.getElementById("emailArea").value = OverviewAppointment.PatientEmail || "";
    document.getElementById("findScheduledTherapist").textContent = OverviewAppointment.overviewTherapist || "";
    document.getElementById("modifyTherapySelector").value = OverviewAppointment.overviewTherapyType || "";
    document.getElementById("findDateArea").value = OverviewAppointment.AptDate || "";
    document.getElementById("findTimeArea").value = OverviewAppointment.AptStartTime || "";
    document.getElementById("findNotesArea").value = OverviewAppointment.AptNotes || "";

    
    document.getElementById("appointmentReturnContainer").style.display = 'flex';
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

