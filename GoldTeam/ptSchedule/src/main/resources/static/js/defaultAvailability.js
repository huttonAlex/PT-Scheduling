

function DefaultDay(DayOfWeek,DefStartTime,DefEndTime) {
    this.DayOfWeek = DayOfWeek;
    this.DefStartTime = DefStartTime;
    this.DefEndTime = DefEndTime;
}

let DefaultDays = [];

let selectedDays = [];

document.addEventListener('DOMContentLoaded', function () {

    const defaultStartTimeSelect = document.getElementById("defaultStartTimeSelect");
    const defaultEndTimeSelect = document.getElementById("defaultEndTimeSelect");
    const dayBoxes = document.querySelectorAll('.day-box');


    dayBoxes.forEach(function(dayBox) {
        dayBox.addEventListener('click', function() {
            toggleDaySelection(dayBox);
        });
    });


    defaultStartTimeSelect.addEventListener('change', function() {
        
		if(defaultStartTimeSelect.value === 'No Availability') {
			defaultEndTimeSelect.disabled = true; 
			defaultEndTimeSelect.value = '';
		} else if (defaultStartTimeSelect.value) {
            defaultStartTimeSelect.disabled = false; 
            populateDefEndTimeOptions(defaultStartTimeSelect.value);
        } else {
            defaultStartTimeSelect.disabled = true; 
        }
    });

    document.getElementById('setDefaultAvailabilityButton').addEventListener('click', function() {
        const startTime = defaultStartTimeSelect.value;
        const endTime = defaultEndTimeSelect.value;
    
        if ((startTime && endTime && selectedDays.length > 0) || (startTime === 'No Availability' && selectedDays.length > 0)) {
            updateDefaultDays(selectedDays, startTime, endTime);
			saveDefaultAvailabilityToBackend(selectedDays, startTime, endTime);
			
			fetchDefaultAvailability().then(() => {
				refreshModifyAvailability();
			})
            
            
            resetSelections();
            alert('Availability updated for selected days.');
        } else {
            alert('Please select days and valid start and end times.');
        }
    });

    defaultEndTimeSelect.addEventListener('change', function() {

    });

});


function populateDefEndTimeOptions(startDefTime) {
    const defaultEndTimeSelect = document.getElementById("defaultEndTimeSelect");
    const startDefHour = parseInt(startDefTime.split(":")[0]);
    const startDefAMPM = startDefTime.split(" ")[1]; 


    defaultEndTimeSelect.innerHTML = `<option value="">--Select End Time--</option>`;

    
    for (let i = 9; i <= 17; i++) {
        const defHour = i > 12 ? i - 12 : i;
        const defAmpm = i < 12 ? 'AM' : 'PM';
        const formattedDefTime = `${defHour}:00 ${defAmpm}`;
        

        const currentDefHourIn24 = (startDefAMPM === 'PM' && startDefHour < 12) ? startDefHour + 12 : startDefHour;
        const endDefHourIn24 = (defAmpm === 'PM' && defHour < 12) ? defHour + 12 : defHour;

        
        if (endDefHourIn24 > currentDefHourIn24) {
            defaultEndTimeSelect.innerHTML += `<option value="${formattedDefTime}">${formattedDefTime}</option>`;
        }
    }
}

function toggleDaySelection(dayBox) {
    const day = dayBox.getAttribute('data-day');

    const index = selectedDays.indexOf(day);
    if (index > -1) {
        
        selectedDays.splice(index, 1);
        dayBox.classList.remove('selected');
    } else {
        
        selectedDays.push(day);
        dayBox.classList.add('selected');
    }

    console.log('Selected Days:', selectedDays);
}

function updateDefaultDays(selectedDays, startTime, endTime) {
    selectedDays.forEach(function(day) {
        
        const defaultDay = DefaultDays.find(function(d) {
            return d.DayOfWeek === day;
        });

        
        if (defaultDay) {
			if (startTime === 'No Availability') {
				defaultDay.DefStartTime = '00:00:00';
				defaultDay.DefEndTime = '00:00:00';
			} else {
				defaultDay.DefStartTime = startTime;
				defaultDay.DefEndTime = endTime;
			}

        }
    });

    
    console.log('Updated DefaultDays:', DefaultDays);
}

function resetSelections() {
    
    selectedDays = [];

    
    const dayBoxes = document.querySelectorAll('.day-box');
    dayBoxes.forEach(function(dayBox) {
        dayBox.classList.remove('selected');
    });

    
    const defaultStartTimeSelect = document.getElementById('defaultStartTimeSelect');
    const defaultEndTimeSelect = document.getElementById('defaultEndTimeSelect');

    defaultStartTimeSelect.value = '';
    defaultEndTimeSelect.innerHTML = `<option value="">--Select End Time--</option>`;
    defaultEndTimeSelect.disabled = false;
}

function displayDefaultAvailability() {

    const workingInfoDiv = document.querySelector('.workingInfo');
    

    workingInfoDiv.innerHTML = '';
    

    const heading = document.createElement('h2');
    heading.textContent = 'Current Default Availability';
    workingInfoDiv.appendChild(heading);
    

    const ul = document.createElement('ul');
    

    DefaultDays.forEach(function(day) {
        const li = document.createElement('li');
        let displayText = `${day.DayOfWeek}: `;
        
        if (day.DefStartTime && day.DefEndTime) {
			const formattedStartTime = formatTimeTo12Hour(day.DefStartTime);
			const formattedEndTime = formatTimeTo12Hour(day.DefEndTime);
			
			if (formattedStartTime === 'Not Available') {
				displayText += 'Not Available';
			} else {
				displayText += `${formattedStartTime} - ${formattedEndTime}`;
			}
            
        } else {
            displayText += 'Not Available';
        }
        
        li.textContent = displayText;
        ul.appendChild(li);
    });
    

    workingInfoDiv.appendChild(ul);
}

function formatTimeTo12Hour(time24) {
	if (time24 === '00:00:00') {
		return 'Not Available';
	}
	const [hourStr, minuteStr, secondStr] = time24.split(':');
	let hour = parseInt(hourStr, 10);
	const minute = minuteStr;
	const ampm = hour >= 12 ? 'PM' : 'AM';
	hour = hour % 12 || 12;
	return `${hour}:${minute} ${ampm}`;
}