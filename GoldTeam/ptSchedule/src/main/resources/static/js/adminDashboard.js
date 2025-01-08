function Therapist(firstName, lastName, therapistId, personId, email, phone, certifications, username, password) {
  Person.call(this, firstName, lastName, "Therapist", personId, username, password);
  this.therapistId = therapistId;
  this.email = email;
  this.phone = phone;
  this.certifications = certifications;
  this.username = username;
  this.password = password;
}


let allPeople = [];
let filteredPeople = [];
const userMap = new Map(); 
const therapistRatings = [];
let systemCertifications = [];
let selectedCertifications = [];
let selectedTherapistCerts = [];
let selectedCertificationsToDelete = [];
let selectedCertificationsToAdd = new Set();

function Person(firstName, lastName, personType, personId, username, password) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.personType = personType;
  this.personId = personId;
  this.username = username;
  this.password = password;
}



function Scheduler(firstName, lastName, schedulerId, personId, email, phone, username, password) {
  Person.call(this, firstName, lastName, "Scheduler", personId, username, password);
  this.schedulerId = schedulerId;
  this.email = email;
  this.phone = phone;
  this.username = username;
  this.password = password;
}


function Admin(firstName, lastName, adminId, personId, email, phone, username, password) {
  Person.call(this, firstName, lastName, "Admin", personId, username, password);
  this.adminId = adminId;
  this.email = email;
  this.phone = phone;
  this.username = username;
  this.password = password;
}


function TherapistRating(ratingId,rating,numRatings) {
    this.ratingId = ratingId;
    this.rating = rating;
    this.numRatings = numRatings;
}


function TherapistCertification(therapyType, abbreviation, description)
{
    this.therapyType = therapyType;
    this.abbreviation = abbreviation;
    this.description = description;
}


let certsForSelectedTherapist = [];


let allTherapists = [];
let allAdmins = [];
let allSchedulers = [];


document.addEventListener('DOMContentLoaded', async function() {
    
    const userTableBody = document.querySelector("#personsTable tbody");
    const userTableHeader = document.querySelector("#personsTable thead");
    const firstNameHeader = document.querySelector("#firstNameHeader");
    const lastNameHeader = document.querySelector("#lastNameHeader");
    const personTypeHeader = document.querySelector("#personTypeHeader");

    const deleteTableBody = document.querySelector("#deleteTable tbody");
    const deleteFirstNameHeader = document.querySelector("#deleteFirstNameHeader");
    const deleteLastNameHeader = document.querySelector("#deleteLastNameHeader");
    const deletePersonTypeHeader = document.querySelector("#deletePersonTypeHeader");

    const editUserForm = document.getElementById("editUserForm");
    const additionalFields = document.getElementById("additionalFields");
    const deleteUsersButton = document.querySelector("#deleteUsersButton");
    const showManageUsersBtn = document.querySelector("#showManageUsers");
    const showDeleteUsersBtn = document.querySelector("#showDeleteUsers");
    const showManageCertsBtn = document.querySelector("#showManageCerts");

    const customAlert = document.querySelector("#customAlert");
    const customAlertMessage = document.querySelector("#customAlertMessage");
    const alertConfirmButton = document.querySelector("#alertConfirmButton");
    const alertCancelButton = document.querySelector("#alertCancelButton");

    const viewUserContainer = document.querySelector("#viewUserContainer");
    const viewFirstName = document.querySelector("#viewFirstName");
    const viewLastName = document.querySelector("#viewLastName");
	const viewPassword = document.querySelector("#viewPassword");
	const viewUserName = document.querySelector("#viewUserName");
    const viewAdditionalFields = document.querySelector("#viewAdditionalFields");
    const editUserBtn = document.querySelector("#editUserBtn");

    const manageCertsPage = document.querySelector("#manageCertsPage");
    const manageUserPage = document.querySelector("#manageUserPage");
    const deleteUsersPage = document.querySelector("#deleteUsersPage");

    const addCertButton = document.getElementById("addCertButton");
    const certTableContainer = document.getElementById("certTableContainer");
    const addCertContainer = document.getElementById("addCertContainer");
    const cancelCertButton = document.getElementById("cancelCertBtn");
    const certButtonContainer = document.getElementById("certButtonContainer");
    const editTherapistCerts = document.querySelector("#editTherapistCerts");
    const addNewUsersBtn = document.getElementById('addNewUsersBtn');
    const addNewUserDiv = document.getElementById('addNewUser');
    const addNewUserRoleType = document.getElementById('addNewUserRoleType');
    const addNewUserAdditional = document.getElementById('addNewUserAdditional');
    const manageUserHeader = document.querySelector('main h1');
	
	const certTherapyTypeHeader = document.getElementById("therapyTypeHeader1");
	const certNameHeader = document.getElementById("certNameHeader1");
	const certDefHeader = document.getElementById("certDefHeader1");

	const cancelCertSelectButton = document.getElementById('cancelCertSelect');
	const cancelUserSelectionButton = document.getElementById("cancelUserSelection");
	
	const cancelDeleteUserSelectionButton = document.getElementById("cancelDeleteUserSelection");
		
	await fetchSystemCertifications();
	

	async function fetchUsers(){
			try {
				const response = await fetch('/api/admin/users');
				const users = await response.json();
				
				
				allTherapists.length = 0;
				allSchedulers.length = 0;
				allAdmins.length = 0;
				userMap.clear();

				users.forEach(user => {
					const {
						personId,
						firstName,
						lastName,
						roleType,
						email,
						phone,
						roleId,
						username,
						password,
						certifications
					} = user;
								
				let personInstance;
							
				if (roleType === "THERAPIST") {
					personInstance = new Therapist(firstName, lastName, roleId, personId, email, phone, certifications, username, password);
					console.log(personInstance);
					
					personInstance.personType = "Therapist";
					allTherapists.push(personInstance);
				} else if (roleType === "SCHEDULER") {
					personInstance = new Scheduler(firstName, lastName, roleId, personId, email, phone, username, password);
					console.log(personInstance);
					personInstance.personType = "Scheduler";
					allSchedulers.push(personInstance);
				} else if (roleType === "ADMINISTRATOR") {
					personInstance = new Scheduler(firstName, lastName, roleId, personId, email, phone, username, password);
					console.log(personInstance);
					
					personInstance.personType = "Admin";
					allAdmins.push(personInstance);
				}
				
				
				userMap.set(personId, personInstance);
			});
			
				
				allPeople = [...allTherapists, ...allSchedulers, ...allAdmins];
				console.log(allPeople);
				
				filteredPeople = [...allPeople]
				console.log(filteredPeople);
				
				
				await fetchTherapistRating();
				
				
				showAllUsers(filteredPeople);
				console.log(filteredPeople)
				showDeleteUsers(filteredPeople);
				
			} catch (error) {
				console.error("Failed to fetch users:", error);
			}			
		}
			
		await fetchUsers();
	
	async function loadCertifications() {
		const certTableBody = document.querySelector("#certsTable tbody");
		certTableBody.innerHTML = "";

		systemCertifications.forEach(cert => {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td class="check-mark-cell"></td>
				<td>${cert.therapyType}</td>
				<td>${cert.abbreviation}</td>
				<td>${cert.description}</td>
			`;
			row.classList.add("selectable-cert-row");
			
			row.onclick = function() {
				toggleCertSelection(row, cert);
				updateAddCertButtonVisibility()
			};
			certTableBody.appendChild(row);
		});
	}
	
	function saveUserChanges(user) {
		console.log("function saveUserChanges");
		const personId = user.personId;
		const firstName = document.getElementById("firstName").value;
		const lastName = document.getElementById("lastName").value;
		const email = document.getElementById("email").value;
		const phone = document.getElementById("phone").value;
		console.log(firstName, lastName, email, phone);
		const payload = {personId, firstName, lastName, email, phone};
		
		fetch(`/api/admin/user/${personId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
		.then(response => response.json())
		.then(data => {
			console.log("User updated:", data);
			fetchUsers();
			window.location.reload(); 
		})
		.catch(error => console.error("Error updating user:", error));
	}
	
	function submitUser() {
		const firstNameField = document.getElementById("addNewUserFirstName");
		const lastNameField = document.getElementById("addNewUserLastName");
		const personTypeField = document.getElementById("addNewUserRoleType");
		const emailField = document.getElementById("addNewUserEmail");
		const phoneField = document.getElementById("addNewUserPhone");


		const firstName = firstNameField.value.trim();
		const lastName = lastNameField.value.trim();
		const personType = personTypeField.value.trim();
		const email = emailField.value.trim();
		const phone = phoneField.value.trim();


		
		const missingFields = [];
		if (!firstName) missingFields.push("First Name");
		if (!lastName) missingFields.push("Last Name");
		if (!personType) missingFields.push("Role Type");
		if (!email) missingFields.push("Email");
		if (!phone) missingFields.push("Phone");


		if (missingFields.length > 0) {
	    	const fieldList = missingFields.join(", ");
	    	showCustomAlert(`Please fill in the following field(s): ${fieldList}`, function() {
	        	
	    	});
	    	return;
		}


		
		const userData = { firstName, lastName, personType, email, phone };
		console.log("Submitting user:", userData);


		
		fetch('/api/admin/user', {
	    	method: 'POST',
	    	headers: {
	        	'Content-Type': 'application/json'
	    	},
	    	body: JSON.stringify(userData)
		})
		.then(response => {
	    	if (!response.ok) {
	        	throw new Error(`HTTP error! status: ${response.status}`);
	    	}
		})
		.then(message => {
	    	


	    	
	    	fetchUsers();


	    	
	    	firstNameField.value = "";
	    	lastNameField.value = "";
	    	personTypeField.value = "";
	    	emailField.value = "";
	    	phoneField.value = "";


	    	
	    	showCustomAlert2("User successfully added!", function() {
	    	});
		})
		.catch(error => {
	    	console.error("Error adding user:", error);


	    	
	    	showCustomAlert("Failed to add user. Please try again.", function() {
	        	
	    	});
		});
	}

	async function fetchTherapistRating(){
		try {
			const response = await fetch('/api/admin/therapist-ratings');
			const ratingString = await response.text();
			
			
			parseTherapistRatings(ratingString);
		} catch (error) {
			console.error("Failed to fetch therapist ratings:", error);
		}
	}
	
	function parseTherapistRatings(ratingString) {
		console.log("parseTherapistRatings")
		therapistRatings.length = 0;
		
		if (ratingString && ratingString.trim() !== "") {
			const ratingArray = ratingString.split("; ");
			
			ratingArray.forEach(rating => {
				const data = rating.split(", ");
				if (data.length >= 3) {
					const therapistId = data[0];
					const currentRating = data[1];
					const numReviews = data[2];
					
					
					const therapistRating = new TherapistRating(therapistId, currentRating, numReviews);
					
					
					therapistRatings.push(therapistRating);
				}
			})
		}
	}
	
	async function fetchSystemCertifications() {
		try {
			const response = await fetch('/api/admin/certifications');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const certifications = await response.json();
			
			systemCertifications.length = 0;
			
			certifications.forEach(cert => {
				const { therapyType, abbreviation, description } = cert;
				const newCert = new TherapistCertification(therapyType, abbreviation, description);
				systemCertifications.push(newCert);
			});
			
			
			loadCertifications();
		} catch (error) {
			console.error("Failed to fetch system certifications:", error);
		}
	}
	
	function loadAvailableCertificationsForTherapist() {
		const addCertTableBody = document.querySelector("#addtherapistCertsTable tbody");
		addCertTableBody.innerHTML = "";
	    
		
		const therapistCerts = new Set(selectedTherapistCerts);
	    
		
		systemCertifications.forEach(cert => {
	    	if (!therapistCerts.has(cert.abbreviation)) {
	        	const row = document.createElement("tr");
	        	row.innerHTML = `
	            	<td>${cert.therapyType}</td>
	            	<td>${cert.abbreviation}</td>
	            	<td>${cert.description}</td>
	        	`;
	        	
	        	row.onclick = function() {
	            	toggleAddTherapistCertSelection(row, cert.abbreviation);
	        	};
	        	addCertTableBody.appendChild(row);
	    	}
		});
	}


	function toggleAddTherapistCertSelection(row, certName) {
		if (row.classList.contains("selected-cert-row")) {
	    	row.classList.remove("selected-cert-row");
	    	selectedCertifications = selectedCertifications.filter(cn => cn !== certName);
		} else {
	    	row.classList.add("selected-cert-row");
	    	selectedCertifications.push(certName);
		}
	}
	
	function updateDeleteCertsButtonVisibility() {
		const deleteCertsButton = document.querySelector("#deleteCertsButton");
		if (selectedCertificationsToDelete.length > 0) {
			deleteCertsButton.style.display = "block";
		} else {
			deleteCertsButton.style.display = "none";
		}
	}
	
    

    document.getElementById("addTherapistCertContainer").style.display = "none";
    document.getElementById("editTherapistCerts").style.display = "none";
    document.getElementById("editUserForm").style.display = "none";
    document.getElementById("manageCertsPage").style.display = "none";
    document.getElementById("deleteUsersPage").style.display = "none";

	let sortByTherapyType = true;
	    let sortByCertName = false;
	    let sortByCertDef = false;

		
    let selectedUser = null;
	let selectedCertificate =null;

    const selectedCertifications = [];
    filteredPeople = [...allPeople];
    let deleteUser = null;
    selectedTherapistCerts = [];


    manageUserPage.style.display = "block";
    document.getElementById("tableContainer").style.display = "block";
    deleteUsersPage.style.display = "none";
    manageCertsPage.style.display = "none";
    editTherapistCerts.style.display = "none";


    showManageUsersBtn.addEventListener('click', function() {
        manageUserHeader.innerHTML = "Manage Users";
        manageUserPage.style.display = "block";
        document.getElementById("tableContainer").style.display = "block";
        deleteUsersPage.style.display = "none";
        manageCertsPage.style.display = "none";
        addNewUserDiv.style.display = 'none';
        editTherapistCerts.style.display = "none";
        editUserForm.style.display = "none";
        addTherapistCertContainer.style.display = "none"; 

        filteredPeople = [...allPeople];
        showAllUsers(filteredPeople);

        dropdown.value = "All";
    });


    showDeleteUsersBtn.addEventListener('click', function() {
        manageUserHeader.innerHTML = "Delete Users"; 
        manageUserPage.style.display = "none";
        deleteUsersPage.style.display = "block";
        manageCertsPage.style.display = "none";
        editTherapistCerts.style.display = "none";
        editUserForm.style.display = "none";
        viewUserContainer.style.display = "none";
        addTherapistCertContainer.style.display = "none"; 
        addNewUserDiv.style.display = 'none';
        filteredPeople = [...allPeople];
        showDeleteUsers(filteredPeople);
        


        deleteDropdown.value = "All";
    });

    addNewUsersBtn.addEventListener('click', function() {
        manageUserHeader.innerHTML = "Add New Users"; 
        manageUserPage.style.display = 'none';
        deleteUsersPage.style.display = 'none';
        manageCertsPage.style.display = 'none';
        editTherapistCerts.style.display = 'none';
        editUserForm.style.display = 'none';
        addTherapistCertContainer.style.display = 'none';
        viewUserContainer.style.display = 'none';
		


        addNewUserDiv.style.display = 'block';
    });

    const addNewUserCancelButton = document.getElementById('addNewUserCancelButton');
    addNewUserCancelButton.addEventListener('click', function() {
       
        addNewUserDiv.style.display = 'none';
        
        
        manageUserPage.style.display = 'block';
    });
	
	const addNewUserSubmitButton = document.getElementById('addNewUserSubmitButton');
	addNewUserSubmitButton.addEventListener('click', function() {
		
		submitUser();
	})

	deleteUsersButton.addEventListener('click', function() {
	    if (!deleteUser) {
	        showCustomAlert("No user selected for deletion.", function() {
	            
	        });
	        return;
	    }
	    let confirmMessage = `Are you sure you want to delete ${deleteUser.personType}: ${deleteUser.firstName} ${deleteUser.lastName}?`;


	    
	    showCustomAlert(confirmMessage, function() {
	        deleteSelectedUser(deleteUser);
			
			cancelDeleteUserSelectionButton.style.display = "none"; 
			deleteUsersButton.style.display = "none";
	    });
	});


    

    

    console.log(allPeople);


    showAllUsers(filteredPeople);
    showDeleteUsers(filteredPeople);

    let sortByFirstName = true;
    let sortByLastName = false;
    let sortDeleteByFirstName = true;
    let sortDeleteByLastName = false;
	
	function updateSortingArrows() {
	        if (sortByFirstName) {
	            firstNameHeader.innerHTML = "First Name &#9650;"; 
	            lastNameHeader.innerHTML = "Last Name";           
	        } else if (!sortByFirstName) {
	            firstNameHeader.innerHTML = "First Name &#9660;"; 
	        }
	        if (sortByLastName) {
	            lastNameHeader.innerHTML = "Last Name &#9650;"; 
	            firstNameHeader.innerHTML = "First Name";
	        } else if (!sortByLastName && !sortByFirstName) {
	            lastNameHeader.innerHTML = "Last Name &#9660;";
	        }
	    }

	    updateSortingArrows();

    if (!therapyType || !certName || !certDef) {
        alert("Please fill out all fields before saving.");
        return;
    }
	
	
	function setInitialSortingArrowCerts() { 
		if (sortByTherapyType) { 
			certTherapyTypeHeader.innerHTML = "Therapy Type &#9650;";
		 } else { 
			certTherapyTypeHeader.innerHTML = "Therapy Type &#9660;"; 
		 } 
		}
		
		setInitialSortingArrowCerts();



	firstNameHeader.addEventListener('click', function() {
	        if (sortByFirstName) {
	            filteredPeople.sort((a, b) => b.firstName.localeCompare(a.firstName));
	            sortByFirstName = false; 
	        } else {
	            filteredPeople.sort((a, b) => a.firstName.localeCompare(b.firstName));
	            sortByFirstName = true;  
	        }
	        sortByLastName = false; 
	        updateSortingArrows();
	        showAllUsers(filteredPeople);
	    });

		lastNameHeader.addEventListener('click', function() {
		        if (sortByLastName) {
		            filteredPeople.sort((a, b) => b.lastName.localeCompare(a.lastName));
		            sortByLastName = false;
		        } else {
		            filteredPeople.sort((a, b) => a.lastName.localeCompare(b.lastName));
		            sortByLastName = true;
		        }
		        sortByFirstName = false;
		        updateSortingArrows();
		        showAllUsers(filteredPeople);
		    });
			
			certTherapyTypeHeader.addEventListener('click', function() {
			        if (sortByTherapyType) {
			            systemCertifications.sort((a, b) => b.therapyType.localeCompare(a.therapyType));
			            sortByTherapyType = false;
			        } else {
			            systemCertifications.sort((a, b) => a.therapyType.localeCompare(b.therapyType));
			            sortByTherapyType = true;
			        }
			        
			        sortByCertName = false;
			        sortByCertDef = false;

			        
			        updateCertsTableSortingArrows();

			        
			        loadCertifications();
			    });

			    certNameHeader.addEventListener('click', function() {
			        if (sortByCertName) {
			            systemCertifications.sort((a, b) => b.certName.localeCompare(a.certName));
			            sortByCertName = false; 
			        } else {
			            systemCertifications.sort((a, b) => a.certName.localeCompare(b.certName));
			            sortByCertName = true;  
			        }
			        
			        sortByTherapyType = false;
			        sortByCertDef = false;

			        
			        updateCertsTableSortingArrows();

			        
			        loadCertifications();
			    });

			    certDefHeader.addEventListener('click', function() {
			        if (sortByCertDef) {
			            systemCertifications.sort((a, b) => b.certDef.localeCompare(a.certDef));
			            sortByCertDef = false;
			        } else {
			            systemCertifications.sort((a, b) => a.certDef.localeCompare(b.certDef));
			            sortByCertDef = true;
			        }
			        
			        sortByTherapyType = false;
			        sortByCertName = false;

			        
			        updateCertsTableSortingArrows();

			        
			        loadCertifications();
			    });

			
			
			
			function updateCertsTableSortingArrows() {
			        if (sortByTherapyType) {
			            certTherapyTypeHeader.innerHTML = "Therapy Type &#9650;"; 
			            certNameHeader.innerHTML = "Certification Name";
			            certDefHeader.innerHTML = "Description";
			        } else {
			            certTherapyTypeHeader.innerHTML = "Therapy Type &#9660;"; 
			        }

			        if (sortByCertName) {
			            certNameHeader.innerHTML = "Certification Name &#9650;"; 
			            certTherapyTypeHeader.innerHTML = "Therapy Type";
			            certDefHeader.innerHTML = "Description";
			        } else if (!sortByTherapyType) {
			            certNameHeader.innerHTML = "Certification Name &#9660;"; 
			        }

			        if (sortByCertDef) {
			            certDefHeader.innerHTML = "Description &#9650;"; 
			            certTherapyTypeHeader.innerHTML = "Therapy Type";
			            certNameHeader.innerHTML = "Certification Name";
			        } else if (!sortByTherapyType && !sortByCertName) {
			            certDefHeader.innerHTML = "Description &#9660;"; 
			        }
			    }

			
			function updateDeleteTableSortingArrows() {
			        if (sortDeleteByFirstName) {
			            deleteFirstNameHeader.innerHTML = "First Name &#9650;"; 
			            deleteLastNameHeader.innerHTML = "Last Name";           
			        } else if (!sortDeleteByFirstName) {
			            deleteFirstNameHeader.innerHTML = "First Name &#9660;"; 
			        }

			        if (sortDeleteByLastName) {
			            deleteLastNameHeader.innerHTML = "Last Name &#9650;";   
			            deleteFirstNameHeader.innerHTML = "First Name";         
			        } else if (!sortDeleteByLastName && !sortDeleteByFirstName) {
			            deleteLastNameHeader.innerHTML = "Last Name &#9660;";   
			        }
			    }

			    updateDeleteTableSortingArrows();

				deleteFirstNameHeader.addEventListener('click', function() {
				        if (sortDeleteByFirstName) {
				            filteredPeople.sort((a, b) => b.firstName.localeCompare(a.firstName));
				            sortDeleteByFirstName = false; 
				        } else {
				            filteredPeople.sort((a, b) => a.firstName.localeCompare(b.firstName));
				            sortDeleteByFirstName = true;  
				        }
				        sortDeleteByLastName = false;  
				        updateDeleteTableSortingArrows();  
				        showDeleteUsers(filteredPeople);
				    });

				    deleteLastNameHeader.addEventListener('click', function() {
				        if (sortDeleteByLastName) {
				            filteredPeople.sort((a, b) => b.lastName.localeCompare(a.lastName));
				            sortDeleteByLastName = false;  
				        } else {
				            filteredPeople.sort((a, b) => a.lastName.localeCompare(b.lastName));
				            sortDeleteByLastName = true;   
				        }
				        sortDeleteByFirstName = false; 
				        updateDeleteTableSortingArrows();
				        showDeleteUsers(filteredPeople);
				    });
					
					function showDeleteUsers(people) {
					  deleteTableBody.innerHTML = "";
					  people.forEach(person => {
						
					    const row = document.createElement("tr");
					    
					    row.innerHTML = `
					      <td class="check-mark-cell"></td> <!-- Check mark cell -->
					      <td>${person.firstName}</td>
					      <td>${person.lastName}</td>
					      <td>${person.personType}</td>
					    `;
					    
					    row.dataset.personId = person.personId;
					    row.classList.add("selectable-delete-row");
					    
					    row.onclick = function() {
					      
					      const previouslySelectedRow = deleteTableBody.querySelector(".selected-delete-row");
					      if (previouslySelectedRow) {
					        previouslySelectedRow.classList.remove("selected-delete-row");
					        const previousCheckMarkCell = previouslySelectedRow.querySelector(".check-mark-cell");
					        if (previousCheckMarkCell) {
					          previousCheckMarkCell.innerHTML = "";
					        }
					      }
					      
					      row.classList.add("selected-delete-row");
					      
					      const checkMarkCell = row.querySelector(".check-mark-cell");
					      if (checkMarkCell) {
					        checkMarkCell.innerHTML = "✔"; 
					      }
					      
					      deleteUser = person;
						  cancelDeleteUserSelectionButton.style.display = "block"; 
						  deleteUsersButton.style.display = "block";
					    };
					    deleteTableBody.appendChild(row);
					  });
					}
				

					

    showManageCertsBtn.addEventListener('click', function() {
        manageUserHeader.innerHTML = "Manage Certifications"; 
        manageCertsPage.style.display = "block";
        manageUserPage.style.display = "none";
        deleteUsersPage.style.display = "none";
        viewUserContainer.style.display = "none";
        editTherapistCerts.style.display = "none";
        editUserForm.style.display = "none";
        addTherapistCertContainer.style.display = "none";
        addNewUserDiv.style.display = 'none';
        
		fetchSystemCertifications();
    });

    addCertButton.addEventListener("click", function() {
        
        certTableContainer.style.display = "none";
        certButtonContainer.style.display = "none";

        
        addCertContainer.style.display = "block";
    });

    
    cancelCertButton.addEventListener("click", function() {
        
        addCertContainer.style.display = "none";

        
        certTableContainer.style.display = "block";
        certButtonContainer.style.display = "block";
    });

    
    const dropdown = document.createElement("select");
    dropdown.innerHTML = `
        <option value="All">All Users</option>
        <option value="Therapist">Therapists</option>
        <option value="Scheduler">Schedulers</option>
        <option value="Admin">Admins</option>
    `;
    personTypeHeader.appendChild(dropdown);

    
    const deleteDropdown = document.createElement("select");
    deleteDropdown.innerHTML = `
        <option value="All">All Users</option>
        <option value="Therapist">Therapists</option>
        <option value="Scheduler">Schedulers</option>
        <option value="Admin">Admins</option>
    `;
    deletePersonTypeHeader.appendChild(deleteDropdown);

    
    dropdown.addEventListener('change', function() {
        const selectedType = dropdown.value;
        filteredPeople = selectedType === "All" ? [...allPeople] : allPeople.filter(person => person.personType === selectedType);
        showAllUsers(filteredPeople);
    });

    
    deleteDropdown.addEventListener('change', function() {
        const selectedType = deleteDropdown.value;
        filteredPeople = selectedType === "All" ? [...allPeople] : allPeople.filter(person => person.personType === selectedType);
        showDeleteUsers(filteredPeople);
    });

    document.getElementById("removeCertsButton").addEventListener("click", function() {
        removeSelectedCertificates();
    });

    
    function setDisplayForAll() {
        userTableBody.innerHTML = "";
        
        editUserForm.style.display = "none";
        userTableHeader.style.display = "table-row-group";
        document.querySelector("#personsTable").style.display = "table";
    }

	function showAllUsers(people) {
	    userTableBody.innerHTML = "";

	    people.forEach(person => {
	        const row = document.createElement("tr");
	        row.classList.add("selectable-row");
	        row.dataset.personId = person.personId;

	        
	        const checkMarkCell = document.createElement("td");
	        checkMarkCell.classList.add("check-mark-cell");
	        checkMarkCell.innerHTML = ""; 

	        
	        let firstNameContent = `${person.firstName}`;

	        
	        if (person.personType === "Therapist") {
	            const therapistRating = therapistRatings.find(rating => rating.ratingId === person.personId.toString());
	            if (therapistRating) {
	                let stars = '';
	                for (let i = 0; i < therapistRating.rating; i++) {
	                    stars += '★';
	                }
	                firstNameContent += ` ${stars}`;
	            }
	        }

	        
	        const firstNameCell = document.createElement("td");
	        firstNameCell.textContent = firstNameContent;

	        const lastNameCell = document.createElement("td");
	        lastNameCell.textContent = person.lastName;

	        const personTypeCell = document.createElement("td");
	        personTypeCell.textContent = person.personType;

	        
	        row.appendChild(checkMarkCell);
	        
	        row.appendChild(firstNameCell);
	        row.appendChild(lastNameCell);
	        row.appendChild(personTypeCell);

	        
	        row.onclick = function () {
	            selectUser(person);
	        };

	        
	        userTableBody.appendChild(row);
	    });
	}


	
	function deleteSelectedUser(user) {
	    fetch(`/api/admin/user/${user.personId}`, {
	        method: 'DELETE'
	    })
	    .then(response => {
			if (response.ok) {
				return response.text();
			} else {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
		})
	    .then(data => {
	        console.log("Deleted user: ", data);
	        
	        fetchUsers();
			
	    })
	    .catch(error => console.error("Error deleting user:", error));
	}


	function viewUser(user) {
	       
			console.log(user);
	       viewFirstName.textContent = user.firstName;
	       viewLastName.textContent = user.lastName;
			viewUserName.textContent = user.username;
			viewPassword.textContent = user.password;
			
			viewRatingStars.textContent = '';
			viewRatingValue.textContent = '';
			viewRating.style.display = 'none';
	       
	      
			if (user.personType === "Therapist") {
			            const therapist = allTherapists.find(t => t.personId === user.personId);
			            if (therapist) {
			                viewEmail.textContent = therapist.email;
			                viewPhone.textContent = therapist.phone;
							
							
							
							    const therapistRating = therapistRatings.find(rating => rating.ratingId === user.personId.toString());
							    if (therapistRating) {
							        let stars = '';
							        for (let i = 0; i < therapistRating.rating; i++) {
							            stars += '★';
							        }
									viewRatingStars.textContent = stars;
									viewRatingValue.textContent = `(${therapistRating.numRatings} ratings)`;
									viewRating.style.display = 'block';						   
								}
							

			            }
				} else if (user.personType === "Scheduler") {
				            const scheduler = allSchedulers.find(s => s.personId === user.personId);
				            if (scheduler) {
				                viewEmail.textContent = scheduler.email; 
				                viewPhone.textContent = scheduler.phone; 
								viewRating.style.display = 'none';
				            }
				        } else if (user.personType === "Admin") {
				            const admin = allAdmins.find(a => a.personId === user.personId);
				            if (admin) {
				                viewEmail.textContent = admin.email; 
				                viewPhone.textContent = admin.phone; 
								viewRating.style.display = 'none';
				            }
				        }
	       
	       viewUserContainer.style.display = "block";
	      
	       editUserBtn.onclick = function() {
	           const firstName = viewFirstName.textContent;
	           const lastName = viewLastName.textContent;
	           manageUserHeader.innerHTML = `Currently Editing: ${firstName} ${lastName}`;
	           if (selectedUser) {
	               
	               document.getElementById("tableContainer").style.display = "none";
	               viewUserContainer.style.display = "none";
	               editTherapistCerts.style.display = "none";
				   cancelUserSelection.style.display = "none";
	      
	               
	               editUser(selectedUser, editUserForm, additionalFields);
	      
	               
	               if (selectedUser.personType === "Therapist") {
	                   showTherapistCertifications(selectedUser);
	               }
	      
	               
	               editUserForm.style.display = "block";
	           } else {
	               console.error("No user selected for editing.");
	           }
	       };
	   }


	function selectUser(person) {
	   
	    const selectedRows = document.querySelectorAll(".selected-row");
	    selectedRows.forEach(row => {
	        row.classList.remove("selected-row");
	        const checkMarkCell = row.querySelector(".check-mark-cell");
	        if (checkMarkCell) {
	            checkMarkCell.innerHTML = "";
	        }
	    });

	    
	    const selectedRow = document.querySelector(`tr[data-person-id='${person.personId}']`);
	    if (selectedRow) {
	        selectedRow.classList.add("selected-row");
	        const checkMarkCell = selectedRow.querySelector(".check-mark-cell");
	        if (checkMarkCell) {
	            checkMarkCell.innerHTML = "✔";
	        }
	    }

	    
	    selectedUser = person;
	    viewUser(person);
		
		cancelUserSelectionButton.style.display = "block";
	}


	function editUser(user, editUserForm, additionalFields) {
	    additionalFields.innerHTML = "";
	    document.getElementById("firstName").value = user.firstName;
	    document.getElementById("lastName").value = user.lastName;
	    document.getElementById("email").value = user.email || "";
	    document.getElementById("phone").value = user.phone || "";
		document.getElementById("username").innerHTML = user.username;
		document.getElementById("password").innerHTML = user.password;	

	    
	    const ratingContainer = document.getElementById("rating-container");
	    const editRatingStars = document.getElementById("editRatingStars");

	    
	    if (user.personType === "Therapist") {
	        
	        ratingContainer.style.display = "block";

	        
	        const therapistRating = therapistRatings.find(
	            (rating) => rating.ratingId === user.personId.toString()
	        );
	        if (therapistRating) {
	            let stars = "★".repeat(therapistRating.rating);
	            editRatingStars.textContent = `${stars} (${therapistRating.numRatings} ratings)`;
	        } else {
	            editRatingStars.textContent = "No ratings available";
	        }
	    } else {
	        
	        ratingContainer.style.display = "none";
	    }

	    
	    editUserForm.style.display = "block";

	    
	    document.getElementById("cancelEditBtn").onclick = function () {
	        editUserForm.style.display = "none";
			editTherapistCerts.style.display = "none";
	        manageUserHeader.innerHTML = "Manage Users";
	        document.getElementById("tableContainer").style.display = "block";
	    };
	}







    async function showTherapistCertifications(user) {
		try {
			const response = await fetch(`/api/admin/therapist/${user.personId}/certifications`);
			if (!response.ok) {
				throw new Error(`HTTP error. status: ${response.status}`);
			}
			const certifications = await response.json();
			
			
			selectedTherapistCerts = [];
			
			
			const certTableBody = document.querySelector("#therapistCertsTable tbody");
			certTableBody.innerHTML = "";
			
			certifications.forEach(abbreviation => {
				const cert = systemCertifications.find(c => c.abbreviation.trim().toLowerCase()=== abbreviation.trim().toLowerCase());
				if (cert) {
					const row = document.createElement("tr");
					row.innerHTML = `<td>${cert.therapyType}</td><td>${cert.abbreviation}</td><td>${cert.description}</td>`;
					row.classList.add("selectable-cert-row");

					
	                row.onclick = function() {
	                    toggleTherapistCertSelection(row, cert.abbreviation);
	                    updateAddTherapistCertButton();
	                };
	    
	                certTableBody.appendChild(row);
				}
			});
			
			editTherapistCerts.style.display = "block";
			} catch (error) {
				console.error("Failed to fetch therapist certifications:", error);
			}

    }

    function updateAddTherapistCertButton() {
        
        const selectedRows = document.querySelectorAll("#therapistCertsTable tbody tr.selected-cert-row");
    
        
        if (selectedRows.length > 0) {
            document.getElementById("addTherapistCertButton").style.display = "none";
        } else {
            document.getElementById("addTherapistCertButton").style.display = "block";
        }
    }
    
    function toggleTherapistCertSelection(row, certName) {
        const certIndex = selectedTherapistCerts.indexOf(certName);
    
        if (certIndex === -1) {
            
            selectedTherapistCerts.push(certName);
            row.classList.add("selected-cert-row");
        } else {
            
            selectedTherapistCerts.splice(certIndex, 1);
            row.classList.remove("selected-cert-row");
        }
    
        console.log("Selected Certificates:", selectedTherapistCerts);
    }
    
    function getCertificationsForTherapist(therapistId) {
        if (selectedUser && selectedUser.personId === therapistId) {
           return selectedTherapistCerts;
        }
        return [];
    }

	 function updateAddCertButtonVisibility() {
	   const addCertButton = document.getElementById("addCertButton");
	   if (selectedTherapistCerts) {
	     addCertButton.style.display = "none";
		 cancelCertSelectButton.style.display = "block";
		 
	   } else {
	     addCertButton.style.display = "block";
		 cancelCertSelectButton.style.display = "none";
	   }
	 }



	function toggleCertSelection(row, cert) {
		
		const index = selectedCertificationsToDelete.findIndex(c => c.abbreviation === cert.abbreviation);
		if (index !== -1) {
	    	
	    	selectedCertificationsToDelete.splice(index, 1);
	    	row.classList.remove("selected-cert-row");
	    	
	    	const checkMarkCell = row.querySelector(".check-mark-cell");
	    	if (checkMarkCell) {
	        	checkMarkCell.innerHTML = ""; 
	    	}
		} else {
	    	
	    	selectedCertificationsToDelete.push(cert);
	    	row.classList.add("selected-cert-row");
	    	
	    	const checkMarkCell = row.querySelector(".check-mark-cell");
	    	if (checkMarkCell) {
	        	checkMarkCell.innerHTML = "✔"; 
	    	}
		}
		
		updateDeleteCertsButtonVisibility();
	}



    function removeSelectedCertificates() {
		if (selectedTherapistCerts.length === 0) {
		    	alert("No certificates selected for removal.");
		    	return;
			}
		    
			const therapistId = selectedUser.personId;
			const promises = [];
		    
			selectedTherapistCerts.forEach(abbreviation => {
		    	promises.push(
		        	fetch(`/api/admin/therapist/${therapistId}/certification/${abbreviation}`, {
		            	method: 'DELETE'
		        	})
		    	);
			});
		    
			Promise.all(promises)
		    	.then(responses => {
		        	const failed = responses.some(response => !response.ok);
		        	if (failed) {
		            	throw new Error("Failed to remove one or more certifications");
		        	}
		        	
		        	showTherapistCertifications(selectedUser);
		    	})
		    	.catch(error => {
		        	console.error("Error removing certifications:", error);
		    	});
    }
    
    function updateTherapistCertifications(therapistId, newCerts) {
        
 		const promises = newCerts.map(abbreviation => {
			return fetch(`/api/admin/therapist/${therapistId}/certification`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ abbreviation })
			});
		});
		
		Promise.all(promises)
			.then(responses => {
				const failed = responses.some(response => !response.ok);
				if (failed) {
					throw new Error("Failed to add certification(s)");
				}
				
				showTherapistCertifications(selectedUser);
			})
			.catch(error => {
				console.error("Error adding certifications to therapist:", error);
			});		
    }
    
    document.getElementById("addTherapistCertButton").addEventListener("click", function() {
        
        document.getElementById("editTherapistCerts").style.display = "none";
        document.getElementById("editUserForm").style.display = "none";
    
        
        document.getElementById("addTherapistCertContainer").style.display = "block";
    
        
        const addCertTableBody = document.querySelector("#addtherapistCertsTable tbody");
    
        
        addCertTableBody.innerHTML = "";
    
        
        systemCertifications.forEach(cert => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${cert.therapyType}</td>
                <td>${cert.abbreviation}</td>
                <td>${cert.description}</td>
            `;
            
            row.addEventListener("click", function() {
                row.classList.toggle("selected-cert-row"); 
            });
    
            
            addCertTableBody.appendChild(row);
        });
		loadAvailableCertificationsForTherapist();
    });

    const deleteCertsButton = document.querySelector("#deleteCertsButton");

	
	deleteCertsButton.addEventListener('click', function() {
		if (selectedCertificationsToDelete.length === 0) {
	    	showCustomAlert("No certifications selected for deletion.", function() {
	        	
	    	});
	    	return;
		}
		let confirmMessage = `Are you sure you want to delete the selected certifications?`;
		
		showCustomAlert(confirmMessage, function() {
	    	deleteSelectedCertifications();
		});
	});

	cancelCertSelectButton.addEventListener('click', function() {
	    
	    selectedCertificate = null;

	    
	    const selectedRow = document.querySelector(".selected-cert-row");
	    if (selectedRow) {
	        selectedRow.classList.remove("selected-cert-row");

	        
	        const checkMarkCell = selectedRow.querySelector(".check-mark-cell");
	        if (checkMarkCell) {
	            checkMarkCell.innerHTML = ""; 
	        }
	    }

	    
	    addCertButton.style.display = "block";
		cancelCertSelectButton.style.display = "none";
	});
	
	cancelUserSelectionButton.addEventListener('click', function() {
	    
	    const selectedRow = document.querySelector(".selected-row");
	    if (selectedRow) {
	        selectedRow.classList.remove("selected-row");
	        
	        const checkMarkCell = selectedRow.querySelector(".check-mark-cell");
	        if (checkMarkCell) {
	            checkMarkCell.innerHTML = ""; 
	        }
	    }
	    
	    selectedUser = null;
	    viewUserContainer.style.display = "none";
		cancelUserSelectionButton.style.display = "none";

	});
	
	cancelDeleteUserSelectionButton.addEventListener('click', function() {
	    
	    const selectedRow = document.querySelector("#deleteTable tbody .selected-delete-row");
	    
	    if (selectedRow) {
	        
	        selectedRow.classList.remove("selected-delete-row");

	        
	        const checkMarkCell = selectedRow.querySelector(".check-mark-cell");
	        if (checkMarkCell) {
	            checkMarkCell.innerHTML = ""; 
	        }
	    }

	    deleteUser = null;

		cancelDeleteUserSelectionButton.style.display = "none"; 
		deleteUsersButton.style.display = "none";

	});





	function deleteSelectedCertifications() {
		const promises = selectedCertificationsToDelete.map(cert => {
	    	return fetch(`/api/admin/certification/${cert.abbreviation}`, {
	        	method: 'DELETE'
	    	});
		});


		Promise.all(promises)
	    	.then(responses => {
	        	const failed = responses.some(response => !response.ok);
	        	if (failed) {
	            	throw new Error("Failed to delete one or more certifications");
	        	}
	        	
	        	fetchSystemCertifications();
	        	
	        	selectedCertificatesToDelete = [];
	        	
	        	updateDeleteCertsButtonVisibility();
	    	})
	    	.catch(error => {
	        	console.error("Error deleting certifications:", error);
	    	});
	}



	document.getElementById("saveCertBtn").addEventListener("click", function() {
	        
	        const therapyType = document.getElementById("therapyType").value;
	        const certName = document.getElementById("certName").value;
	        const certDef = document.getElementById("certDef").value;
	    
	        
	        if (!therapyType || !certName || !certDef) {
				showCustomAlert("Please fill out all fields before saving.", function() {
					    	});
	            return;
	        }
	    
			const certData = { therapyType, abbreviation: certName, description: certDef };
			
			fetch('/api/admin/certification', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(certData)
			})
			.then(response => {
				if (response.ok) {
					fetchSystemCertifications();
					
			        addCertContainer.style.display = "none";
			        certTableContainer.style.display = "block";
			        certButtonContainer.style.display = "block";
			    
			        
			        document.getElementById("therapyType").value = "";
			        document.getElementById("certName").value = "";
			        document.getElementById("certDef").value = "";
					showCustomAlert2("Certificate successfully added!", function() {
					    	});
			    
			        }
			})
			.catch(error => {
				console.error("Error adding certification:", error);
			});
	        
	    });


    function toggleAddTherapistCertSelection(row, certName) {
        if (row.classList.contains("selected-cert-row")) {
            row.classList.remove("selected-cert-row");
        } else {
            row.classList.add("selected-cert-row");
        }
    }
    
    
    document.querySelectorAll("#addtherapistCertsTable tbody tr").forEach(row => {
        const certName = row.children[1].textContent; 
        row.addEventListener("click", function () {
            toggleAddTherapistCertSelection(row, certName);
        });
    });
    
    document.getElementById("addCertsToTherapist").addEventListener("click", function() {
        const selectedRows = document.querySelectorAll("#addtherapistCertsTable tbody tr.selected-cert-row");
        
        
        let currentCerts = getCertificationsForTherapist(selectedUser.personId);
    
        selectedRows.forEach(row => {
            const certName = row.children[1].textContent; 
            if (!currentCerts.includes(certName)) {
                currentCerts.push(certName); 
            }
        });
    
        
        updateTherapistCertifications(selectedUser.personId, currentCerts);
    
        console.log("Updated Therapist Certifications: ", currentCerts);
        
        
        document.getElementById("addTherapistCertContainer").style.display = "none";
        document.getElementById("editTherapistCerts").style.display = "block";
        editUserForm.style.display = "block";
    
        
        showTherapistCertifications(selectedUser);
    });

    document.getElementById("cancelAddCerts").addEventListener("click", function() {
        
        document.getElementById("addTherapistCertContainer").style.display = "none";
    
        
        document.getElementById("editTherapistCerts").style.display = "block";
        document.getElementById("editUserForm").style.display = "block";
    });

    document.getElementById("saveChangesBtn").addEventListener("click", function() {
        if (selectedUser) {
            
            selectedUser.firstName = document.getElementById("firstName").value;
            selectedUser.lastName = document.getElementById("lastName").value;
    
            
            if (selectedUser.personType === "Therapist") {
                const therapist = allTherapists.find(t => t.personId === selectedUser.personId);
                if (therapist) {
                    therapist.firstName = selectedUser.firstName;
                    therapist.lastName = selectedUser.lastName;
                    therapist.email = document.getElementById("email").value;
                    therapist.phone = document.getElementById("phone").value;
                }
            } else if (selectedUser.personType === "Scheduler") {
                const scheduler = allSchedulers.find(s => s.personId === selectedUser.personId);
                if (scheduler) {
                    scheduler.firstName = selectedUser.firstName;
                    scheduler.lastName = selectedUser.lastName;
                }
            } else if (selectedUser.personType === "Admin") {
                const admin = allAdmins.find(a => a.personId === selectedUser.personId);
                if (admin) {
                    admin.firstName = selectedUser.firstName;
                    admin.lastName = selectedUser.lastName;
                }
            }
    
            console.log("Changes saved for user:", selectedUser);
    
            
            editUserForm.style.display = "block";
			console.log(selectedUser);
			saveUserChanges(selectedUser);
    
            showAllUsers(filteredPeople);
        } else {
            console.error("No user selected for saving changes.");
        }
    });
	
	document.getElementById("doneButton1").onclick = function() {
	           
	            editUserForm.style.display = "none";
	            editTherapistCerts.style.display = "none";
	            manageUserHeader.innerHTML = "Manage Users";
	            document.getElementById("tableContainer").style.display = "block";
	       
	        };
			
			document.getElementById("doneButton2").onclick = function() {
				           
				            editUserForm.style.display = "none";
				            editTherapistCerts.style.display = "none";
				            manageUserHeader.innerHTML = "Manage Users";
				            document.getElementById("tableContainer").style.display = "block";
				       
				        };



    function showCustomAlert(message, onConfirm) {
        
        customAlertMessage.innerHTML = message;
    
        
        customAlert.style.display = "block"; 
    
        
        alertConfirmButton.onclick = function() {
            onConfirm();
            customAlert.style.display = "none"; 
        };
    
        
        alertCancelButton.onclick = function() {
            customAlert.style.display = "none"; 
        };
    
    }
	
	function showCustomAlert2(message, onConfirm) {
		        
		        customAlertMessage2.innerHTML = message;
		    
		        
		        customAlert2.style.display = "block"; 
		    
		        
		        alertConfirmButton2.onclick = function() {
		            onConfirm();
		            customAlert2.style.display = "none"; 
		        };
		        
		    
		    }

});

