const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let date = new Date(), 
	currYear = date.getFullYear(), 
	currMonth = date.getMonth(); 
	
let selectedDate = null;
let passLastDate;
let passFirstDate;



function DefaultModDay(modDayOfWeek,modDefStartTime,modDefEndTime) {
    this.modDayOfWeek = modDayOfWeek;
    this.modDefStartTime = modDefStartTime;
    this.modDefEndTime = modDefEndTime;
}



let DefaultModDays = []


function DaySchedule(ScheduleDayOfWeek,SchedDate,SchedStartTime,SchedEndTime,ModOrDef) {
    this.ScheduleDayOfWeek = ScheduleDayOfWeek;
    this.SchedDate = SchedDate;
    this.SchedStartTime = SchedStartTime;
    this.SchedEndTime = SchedEndTime;
    this.ModOrDef = ModOrDef;
}


function ModifiedDate(ModifiedDate,ModifiedStartTime,ModifiedEndTime){
    this.ModifiedDate = ModifiedDate;
    this.ModifiedStartTime = ModifiedStartTime;
    this.ModifiedEndTime = ModifiedEndTime;
}

let ModifiedDays = [];
const dateList = [];

let daySchedules = [];
const timeSelectContainer = document.querySelector(".timeSelectContainer");


document.addEventListener('DOMContentLoaded', function () {
    const currentDate = document.querySelector(".current-date");
    const daysTag = document.querySelector(".days"),
        prevNextIcon = document.querySelectorAll(".icons span");

    const startTimeSelect = document.getElementById("startTimeSelect");
    const endTimeSelect = document.getElementById("endTimeSelect");
    const setAvailabilityButton = document.getElementById("setAvailabilityButton");
	const viewDefaultSched = document.getElementById("viewDefaultSched");
	const timeSelectContainer = document.querySelector(".timeSelectContainer");
	const buttonContainer = document.getElementById("buttonContainer");

	
	    const viewModifyAvail = document.getElementById("viewModifyAvail");
	    const dayBoxes = document.querySelectorAll(".day-box");
		const dateInfoDisplay = document.querySelector(".dateInfoDisplay");
		
		dayBoxes.forEach((box) => {
		        box.addEventListener("click", () => {
		          box.classList.toggle("selected");
		        });
		    });
			

    
    renderCalendar(currentDate, daysTag);
	fetchDefaultAvailability().then(() => {
		populateModifiedDays();
	})


    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
            if (currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            }
            renderCalendar(currentDate, daysTag);
			fetchDefaultAvailability().then(() => {
				populateModifiedDays();
			})
			
        });
    });
	
	markCalendarDays(daySchedules);

    
    daysTag.addEventListener('change', function() {
        if (document.querySelector(".days li.selected")) {
            startTimeSelect.disabled = false; 
        }
    });

    startTimeSelect.addEventListener('change', function() {
        if (startTimeSelect.value) {
            endTimeSelect.disabled = false; 
            populateEndTimeOptions(startTimeSelect.value);
        } else {
            endTimeSelect.disabled = true; 
        }
    });

    endTimeSelect.addEventListener('change', function() {
        
    });

    setAvailabilityButton.addEventListener('click', function() {
      
        const startTime = startTimeSelect.value;
        const endTime = endTimeSelect.value;

        if (selectedDate && startTime && endTime) {
            
			
			saveModifiedAvailabilityToBackend(selectedDate, startTime, endTime);
			
            
        } else {
            alert("Please select dates and times before setting time off.");
        }
    });
	
	document.getElementById("viewModifyAvail").addEventListener("click", function () {
	        viewModAvailibility();
	    });

	    document.getElementById("viewDefaultSched").addEventListener("click", function () {
	        viewDefaultAvailibility();
	    });
		
	document.getElementById('cancelAvailabilityButton').addEventListener('click', function(){

		if (selectedDate) {
			const currentStartTime = startTimeSelect.value;
			const currentEndTime = endTimeSelect.value;
			if (currentStartTime && currentEndTime) {
				cancelLeaveRequestToBackend(selectedDate, currentStartTime, currentEndTime);
				alert("Leave request canceled for selected date.");
			} else {
				alert("Please select start and end times to cancel the leave request.");
			}
			
		} else {
			alert("Please select a date to cancel leave request.")
		}
		});
	
});

function renderCalendar(currentDate, daysTag) {
  let
      firstDateofMonth = new Date(currYear, currMonth, 1, 0).getDate(),
      firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
 
  const formattedFirstDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(firstDateofMonth).padStart(2, '0')}`;
  const formattedLastDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(lastDateofMonth).padStart(2, '0')}`;
  const timeSelectContainer = document.querySelector(".timeSelectContainer");
  passFirstDate = formattedFirstDate;
  passLastDate = formattedLastDate;
  dateList.length = 0;
  generateDateRange(passFirstDate, passLastDate);
 
  daySchedules = createDaySchedules(DefaultModDays, ModifiedDays, dateList);
  let liTag = "";
  
  for (let i = firstDayofMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
  }
  
  for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday = "";
      const formattedDate = `${currYear}-${String(currMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      liTag += `<li class="${isToday}" data-date="${formattedDate}">${i}</li>`;
  }
  
  for (let i = lastDayofMonth; i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
  }
  currentDate.innerText = `${months[currMonth]} ${currYear}`;
  daysTag.innerHTML = liTag;
  
  const dayElements = document.querySelectorAll(".days li:not(.inactive)");
  dayElements.forEach(day => {
      day.addEventListener("click", function () {
          const formattedDate = this.dataset.date;
		  dayElements.forEach(d => d.classList.remove("selected"));
		  selectedDate = null;
		  this.classList.add("selected");
		  selectedDate = formattedDate;
		  console.log("Selected Date: ", selectedDate);
		  populateDateInfoDisplay();
		  

      });
  });
  markCalendarDays(daySchedules);
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
    return selectedDates.map(date => ({ date, startTime, endTime}));
	
	
}


function displayAvailability(availableDates) {
    const availabilityList = document.getElementById("availabilityList");
    availabilityList.innerHTML = '';

    availableDates.forEach(availability => {
        const listItem = document.createElement('div');
        listItem.innerHTML = `Date: ${availability.date}, Start Time: ${availability.startTime}, End Time: ${availability.endTime}`;
        availabilityList.appendChild(listItem);
    });
}

function saveAvailabilityToBackend(selectedDates, startTime, endTime) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/therapist/availability", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	const startTime24 = convertTo24HourFormat(startTime);
	const endTime24 = convertTo24HourFormat(endTime);
	
	const data = JSON.stringify({ dates: selectedDates, 
								  startTime: startTime24, 
								  endTime: endTime24 
							  });
	
	xhr.onload = function () {
		if (xhr.status === 200) {
			console.log("Availability successfully saved")
		} else {
			alert("Error saving availability, Please try again");
		}
	};
	xhr.send(data);
}

function convertTo24HourFormat(time) {
	if (time === 'No Availability') {
		return '00:00:00';
	}
	const [timePart, modifier] = time.split(" ");
	let [hours, minutes] = timePart.split(":");
	
	if (modifier === "PM" && hours !== "12") {
		hours = parseInt(hours, 10) + 12;
	}
	if (modifier === "AM" && hours === "12") {
		hours == "00";
	}
	
	hours = String(hours).padStart(2, '0');
	return `${hours}:${minutes}:00`;
}

function viewModAvailibility() {

    headerTitle.textContent = "Set Time Off";
    
    modifyAvailContainer.style.display = 'flex';
    
    defaultAvailContainer.style.display = 'none'; 

    appointmentOverviewContainer.style.display = 'none';
   
}

function viewDefaultAvailibility() {
    const headerTitle = document.getElementById("headerTitle");
    const defaultAvailContainer = document.getElementById("defaultAvailContainer");
    const modifyAvailContainer = document.getElementById("modifyAvailContainer");

    
        headerTitle.textContent = "Set Availability";
        modifyAvailContainer.style.display = 'none';
        defaultAvailContainer.style.display = 'flex';
        appointmentOverviewContainer.style.display = 'none';
    
}



function generateDateRange(passFirstDate, passLastDate) {
    const startDate = new Date(passFirstDate);
    const endDate = new Date(passLastDate);
 
    while (startDate <= endDate) {
        
        const formattedModDate = startDate.toISOString().split('T')[0];
        dateList.push(formattedModDate);

        
        startDate.setDate(startDate.getDate() + 1);
    }

    return dateList;
}

function createDaySchedules(defaultModDays, modifiedDays, dateList) {
    const daySchedules = [];

    
    function getDayOfWeek(dateString) {
        const date = new Date(dateString);
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return daysOfWeek[date.getDay()];
    }

    dateList.forEach(date => {
        
        let scheduleDayOfWeek = getDayOfWeek(date);

        
        const modifiedDate = modifiedDays.find(modified => modified.ModifiedDate === date);
        let scheduleStartTime;
        let scheduleEndTime;
        let modOrDef;

        if (modifiedDate) {
            
            if (modifiedDate.ModifiedStartTime === "00:00" && modifiedDate.ModifiedEndTime === "00:00") {
                
                scheduleStartTime = modifiedDate.ModifiedStartTime;
                scheduleEndTime = modifiedDate.ModifiedEndTime;
                modOrDef = "off";
            } else {
                scheduleStartTime = modifiedDate.ModifiedStartTime;
                scheduleEndTime = modifiedDate.ModifiedEndTime;
                modOrDef = "Modified";
            }
        } else {
            
            const defaultDay = defaultModDays.find(defaultDay => defaultDay.modDayOfWeek === scheduleDayOfWeek);
            if (defaultDay) {
                scheduleStartTime = defaultDay.modDefStartTime;
                scheduleEndTime = defaultDay.modDefEndTime;
                modOrDef = "Default";
            }
        }

        
        const daySchedule = new DaySchedule(scheduleDayOfWeek, date, scheduleStartTime, scheduleEndTime, modOrDef);
        daySchedules.push(daySchedule);
    });

    return daySchedules;
}


function markCalendarDays(daySchedules) {
    daySchedules.forEach(daySchedule => {
        const dayElement = document.querySelector(`.days li[data-date='${daySchedule.SchedDate}']`);
        if (dayElement) {
            if (daySchedule.ModOrDef === "Default") {
                
                dayElement.classList.add("default-day");
            } else if (daySchedule.ModOrDef === "Modified") {
                
                dayElement.classList.add("modified-day");
            }
        }
    });
}

function populateDateInfoDisplay() {
    const dateInfoDisplay = document.querySelector(".dateInfoDisplay");
    dateInfoDisplay.style.display = 'flex';
    dateInfoDisplay.innerHTML = "";

    if (selectedDate) {
        const daySchedule = daySchedules.find(schedule => schedule.SchedDate === selectedDate);
        if (daySchedule) {
            const infoDiv = document.createElement("div");
            infoDiv.classList.add("date-info-box");

            
            let startTime, endTime;
            if (daySchedule.ModOrDef === "Default") {
                startTime = "Regular Schedule";
                endTime = "Regular Schedule";
            } else {
                startTime = formatTimeTo12Hour(daySchedule.SchedStartTime);
                endTime = formatTimeTo12Hour(daySchedule.SchedEndTime);
            }

            infoDiv.innerHTML = `
                <p>Day of Week: ${daySchedule.ScheduleDayOfWeek}</p>
                <p>Date: ${daySchedule.SchedDate}</p>
                <p>Start Off Time: ${startTime}</p>
                <p>End Off Time: ${endTime}</p>
            `;

            
            dateInfoDisplay.appendChild(infoDiv);
        }
    }
}

function getWeekdayOrder(weekday) {
    
    const weekdayOrder = {
        "Monday": 1,
        "Tuesday": 2,
        "Wednesday": 3,
        "Thursday": 4,
        "Friday": 5,
        "Saturday": 6,
        "Sunday": 7
    };
    return weekdayOrder[weekday];
}

async function fetchScheduleIds() {
	try{
		const response = await fetch(`/api/therapist/schedule-ids`);
		const scheduleIds = await response.json();
		console.log("Fetched Schedule IDs:", scheduleIds);
		return scheduleIds;
	} catch (error) {
		console.error("Error fetching schedule Ids:", error);
		return[];
	}
}

async function fetchScheduleInformation(scheduleId) {
	try {
		const response = await fetch(`/api/therapist/schedule-info?scheduleId=${scheduleId}`);
		const scheduleInfo = await response.json();
		console.log("Fetched schedule information for id", scheduleId, ":", scheduleInfo);
		return scheduleInfo;
		
	} catch (error) {
		console.error("Error fetching schedule information:", error);
		return null;
	}
}

async function populateModifiedDays() {
	return new Promise(async (resolve, reject) => {
		try {
			    	const startDate = passFirstDate;
			    	const endDate = passLastDate;
			    	const response = await fetch(`/api/therapist/modified-availability?startDate=${startDate}&endDate=${endDate}`);
			    	const data = await response.json();
			    	ModifiedDays.length = 0;
			    	data.forEach(item => {
			        	const modifiedDate = new ModifiedDate(
			            	item.date,
			            	item.startTime,
			            	item.endTime
			        	);
			        	ModifiedDays.push(modifiedDate);
			    	});
			    	console.log("ModifiedDays populated:", ModifiedDays);
			    	daySchedules = createDaySchedules(DefaultModDays, ModifiedDays, dateList);
			    	renderCalendar(document.querySelector(".current-date"), document.querySelector(".days"));
					resolve();
				} catch (error) {
			    	console.error("Error fetching modified availability:", error);
					reject(error);
				}
		
	});
	

}

function saveDefaultAvailabilityToBackend(selectedDays, startTime, endTime) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/therapist/default-schedule", true);
	xhr.setRequestHeader("Content-Type", "application/json");


	let startTime24, endTime24;
	
	if (startTime === 'No Availability') {
		startTime24 = '00:00:00';
		endTime24 = '00:00:00';
	} else {
		startTime24 = convertTo24HourFormat(startTime);
		endTime24 = convertTo24HourFormat(endTime);
	}

	const data = JSON.stringify({
    	daysOfWeek: selectedDays,
    	startTime: startTime24,
    	endTime: endTime24
	});


	xhr.onload = function () {
    	if (xhr.status === 200) {
        	console.log("Default availability successfully saved");
        	
        	fetchDefaultAvailability().then(() => {
				
				refreshModifyAvailability();
			});
    	} else {
        	alert("Error saving default availability. Please try again.");
    	}
	};
	xhr.send(data);
}

function fetchDefaultAvailability() {
	return fetch('/api/therapist/default-schedule')
    	.then(response => response.json())
    	.then(data => {
			DefaultModDays = [];
			DefaultDays = [];
			
			
			data.forEach(item => {
				
				dayOfWeek = item.dayOfWeek.charAt(0).toUpperCase() + item.dayOfWeek.slice(1).toLowerCase();
				
				defaultModDay = new DefaultModDay(
					
					dayOfWeek,
					item.startTime,
					item.endTime
				);
				console.log(defaultModDay);
				DefaultModDays.push(defaultModDay);


				const defaultDay = new DefaultDay(
					dayOfWeek,
					item.startTime,
					item.endTime
				);
				DefaultDays.push(defaultDay);
			});
			
			
			console.log('Updated DefaultModDays:', DefaultModDays);
			console.log(DefaultDays);
			
			
        	displayDefaultAvailability();
    	})
		
    	.catch(error => {
        	console.error('Error fetching default availability:', error);
    	});
}

function saveModifiedAvailabilityToBackend(selectedDate, startTime, endTime) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/therapist/modify-availability", true);
	xhr.setRequestHeader("Content-Type", "application/json");
	
	console.log(selectedDate.date)


	const startTime24 = convertTo24HourFormat(startTime);
	const endTime24 = convertTo24HourFormat(endTime);


	const data = JSON.stringify({
    	date: selectedDate,
    	startTime: startTime24,
    	endTime: endTime24
	});


	xhr.onload = function () {
    	if (xhr.status === 200) {
        	console.log("Availability successfully modified");
			alert("Availability successfully modified")
        	
        	populateModifiedDays();
    	} else if (xhr.status === 409){
        	alert("Cannot submit leave request due to conflicting appointments.");
    	} else {
			alert("Error submitting leave request. Please try again.")
		}
	};
	xhr.send(data);
}

function fetchAppointmentsForMonth(year, month) {
	fetch(`/api/therapist/appointments?year=${year}&month=${month + 1}`)
    	.then(response => response.json())
    	.then(appointments => {
			console.log("Fetched Appointments:", appointments);
        	returnedAppointments = appointments;
        	renderOverviewCalendar();
    	})
    	.catch(error => {
        	console.error("Failed to fetch appointments for the month.", error);
    	});
}

function refreshModifyAvailability() {
	fetchDefaultAvailability().then(() => {
		populateModifiedDays();
	
	});
}

function cancelLeaveRequestToBackend(selectedDate, currentStartTime, currentEndTime) {
	const xhr = new XMLHttpRequest();
	xhr.open("POST", "/api/therapist/cancel-availability", true);
	xhr.setRequestHeader("Content-Type", "application/json");


	const startTime24 = convertTo24HourFormat(currentStartTime);
	const endTime24 = convertTo24HourFormat(currentEndTime);


	const data = JSON.stringify({
    	date: selectedDate,
    	startTime: startTime24,
    	endTime: endTime24
	});


	xhr.onload = function () {
    	if (xhr.status === 200) {
        	console.log("Leave request successfully canceled");
        	populateModifiedDays();
    	} else {
        	alert("Error canceling leave request. Please try again.");
    	}
	};
	xhr.send(data);
}