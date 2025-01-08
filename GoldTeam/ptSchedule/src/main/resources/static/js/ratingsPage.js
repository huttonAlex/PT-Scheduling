

function Therapist(firstName, lastName, therapistId,numRatings,rating){
    this.firstName = firstName;
    this.lastName = lastName;
    this.therapistId = therapistId;
    this.numRatings = numRatings;
    this.rating = rating;
}



document.addEventListener('DOMContentLoaded', async function () {
	const therapists = await fetchTherapists();
	const setRatingButton = document.getElementById("setRating");
	let selectedTherapist = null;
	
	displayRatings();
	
	async function fetchTherapists() {
		try {
			const response = await fetch('/api/therapist/therapists');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			console.error("Error fetching therapists:", error);
			return[];
		}
	}
	
	async function submitRating(therapistId, rating) {
		try {
			
			const response = await fetch(`/api/therapist/${therapistId}/rate?rating=${rating}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const result = await response.text();
			
			
			const updatedTherapists = await fetchTherapists();
			therapists.length = 0;
			updatedTherapists.forEach(t => therapists.push(t));
			
			displayRatings();
		} catch(error) {
			console.error("Error sumbitting rating:", error);
			alert("Failed to submit rating.");
		}
		
	}
    document.getElementById("scheduleAppointment").addEventListener("click", function () {
        scheduleAppointment();
    });

    

    document.getElementById("viewAppointments").addEventListener("click", function () {
        appointmentOverview();
    });

    document.getElementById("ratingsPageView").addEventListener("click", function () {
        viewRatingPage();
    });


    const stars = document.querySelectorAll("#starRating .star");
    
    stars.forEach((star) => {
        star.addEventListener("click", function () {
            const value = parseInt(star.getAttribute("data-value"), 10);
            stars.forEach((s) => {
                if (parseInt(s.getAttribute("data-value"), 10) <= value) {
                    s.classList.add("selected");
                } else {
                    s.classList.remove("selected");
                }
            });
        });
    });

    
    function displayRatings() {
        const tableBody = document.querySelector("#therapistRatingsTable tbody");
        const ratingBox = document.querySelector("#ratingBox");
        const nameLabel = document.querySelector("#ratingBox label[for='therapistName']");
        const numRatingsLabel = document.querySelector("#ratingBox label[for='numRatings']");

        tableBody.innerHTML = "";

        therapists.forEach((therapist, index) => {
            const row = document.createElement("tr");

            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `therapist-checkbox-${index}`;
            checkbox.value = therapist.therapistId;
            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            const nameBox = document.createElement("td");
            nameBox.textContent = `${therapist.firstName} ${therapist.lastName}`;
            row.appendChild(nameBox);

            const ratingsBox = document.createElement("td");
            ratingsBox.textContent = therapist.numRatings;
            row.appendChild(ratingsBox);

            row.addEventListener("click", function () {
                if (row.classList.contains("selected-row")) {
                    checkbox.checked = false;
                    row.classList.remove("selected-row");
                    nameLabel.textContent = "Name:";
                    numRatingsLabel.textContent = "Number of Ratings:";
                    ratingBox.style.display = 'none';
                    selectedTherapist = null;
                } else {
                    const allCheckboxes = tableBody.querySelectorAll("input[type='checkbox']");
                    const allRows = tableBody.querySelectorAll("tr");

                    allCheckboxes.forEach(cb => (cb.checked = false));
                    allRows.forEach(r => r.classList.remove("selected-row"));

                    checkbox.checked = true;
                    row.classList.add("selected-row");
                    nameLabel.textContent = `Name: ${therapist.firstName} ${therapist.lastName}`;
                    numRatingsLabel.textContent = `Number of Ratings: ${therapist.numRatings}`;
                    ratingBox.style.display = 'block';
                    selectedTherapist = therapist; 
                }
            });

            tableBody.appendChild(row);
        });
    }

    
    setRatingButton.addEventListener("click", function () {
        if (!selectedTherapist) {
            alert("Please select a therapist to rate.");
            return;
        }

        const selectedStars = document.querySelectorAll("#starRating .star.selected").length;

        if (selectedStars === 0) {
            alert("Please select a rating.");
            return;
        }
		
		submitRating(selectedTherapist.therapistId, selectedStars);
		
		const stars = document.querySelectorAll("#starRating .star");
		stars.forEach(star => star.classList.remove("selected"));
		
		
        alert(`Rated ${selectedTherapist.firstName} ${selectedTherapist.lastName} ${selectedStars} stars.`);

        
        
        

        ratingBox.style.display = "none";

        
        const selectedRow = document.querySelector(".selected-row");
        if (selectedRow) {
            selectedRow.classList.remove("selected-row");
            const selectedCheckbox = selectedRow.querySelector("input[type='checkbox']");
            if (selectedCheckbox) {
                selectedCheckbox.checked = false;
            }
        }
    
        
        selectedTherapist = null;

    });

    
    displayRatings();
});