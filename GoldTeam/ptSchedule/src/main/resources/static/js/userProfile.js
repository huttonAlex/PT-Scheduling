
const Roles = Object.freeze
({
    SCHEDULER: "SCHEDULER",
    THERAPIST: "THERAPIST",
    ADMINISTRATOR: "ADMINISTRATOR"
});


const CertificationsTableColumns = Object.freeze
({
    THERAPY_TYPE: 0,
    CERT_NAME: 1,
    CERT_DEFINITION: 2
});

/**
 * Constructor for person.
 * 
 * @param firstName the first name of the user.
 * @param lastName the last name of the user.
 * @param personType the person type of the user
 * @param personId the person id of the user.
 */
function Person(firstName, lastName, personType, personId)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.personType = personType;
    this.personId = personId;
}

/**
 * Constructor for scheduler.
 * 
 * @param firstName the first name of the user.
 * @param lastName the last name of the user.
 * @param schedulerId the scheduler id of the user
 * @param personId the person id of the user.
 */
function Scheduler(firstName, lastName, schedulerId, personId)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.schedulerId = schedulerId;
    this.personId = personId;
}

/**
 * Constructor for therapist.
 * 
 * @param firstName the first name of the user.
 * @param lastName the last name of the user.
 * @param therapistId the therapist id of the user
 * @param personId the person id of the user.
 * @param email the email of the user.
 * @param phone the phone number of the user.
 */
function Therapist(firstName, lastName, therapistId, personId, email, phone)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.therapistId = therapistId;
    this.personId = personId;
    this.email = email;
    this.phone = phone;
}

/**
 * Constructor for therapist certification.
 */
function TherapistCertification(therapyType, certName, certDef)
{
    this.therapyType = therapyType;
    this.certName = certName;
    this.certDef = certDef;
}

/**
 * Constructor for administrator.
 * 
 * @param firstName the first name of the user.
 * @param lastName the last name of the user.
 * @param adminId the admin id of the user
 * @param personId the person id of the user.
 */
function Admin(firstName, lastName, adminId, personId)
{
    this.firstName = firstName;
    this.lastName = lastName;
    this.adminId = adminId;
    this.personId = personId;
}

let person1 = new Person("Paul", "Rudd", "SCHEDULER", "001");
let person2 = new Person("Keanu", "Reeves", "THERAPIST", "005");
let person3 = new Person("Kevin", "Conroy", "ADMINISTRATOR", "010");

let scheduler1 = new Scheduler("Paul", "Rudd","001","001");
let therapist1 = new Therapist("Keanu", "Reeves","005","005","keanureeves@gmail.com", "946-537-6633"); 
let admin1 = new Admin("Kevin", "Conroy","010","010");

let certification1 = new TherapistCertification("Geriatic Therapy","GCS","Geriatric Certified Specialist");

var certificationsTable;
var user;
var userRoleData;

let certificationsTableShown = false;

/**
 * Loads and sets basic user data and fields.
 * 
 * @return none
 */
function LoadUserData() {
	fetch("/api/user/profile-info")
		.then(response => response.json())
		.then(data => {
			console.log("data from userProfile endpoint: " + data);
			document.getElementById("nameOfUser").innerText = data.fullName;
			document.getElementById("phoneNumber").innerText = `Phone #: ${data.phone}`;
			document.getElementById("email").innerText = `Email: ${data.email}`;
			//document.getElementById("userId").innerText = `User ID: ${data.personId}`;
			//document.getElementById("roleId").innerText = `Role ID: ${data.roleId}`;
			
			if (data.role === "THERAPIST") {
				
				displayCertifications(data.therapistCertifications);
				console.log("Cert DATa: " + data.therapistCertifications);
			} else {
				//document.getElementById("phoneNumber").style.display = "none";
				//document.getElementById("email").style.display = "none";
				document.getElementById("certificationsDiv").style.display = "none";
			}
		});
		//.catch(error => console.error('Error fetching user data:', error));
	}


function displayCertifications(certifications) {
	certifications.forEach(cert => {
		const certElement = document.createElement("p");
		certElement.innerText = `Certification: ${cert.certAbbr} - ${cert.therapyType}`;
		document.getElementById("certificationsDiv").appendChild(certElement);
	});
}

    
/**
 * Creates the certifications table for the administrator's certifications
 * 
 * @return none
 */
function CreateCertificationsTable()
{
    var table = document.createElement('table');
    
    var caption = table.createCaption();
    caption.textContent = "Certifications";
    
    var thead = table.createTHead();
    var columnHeaders = thead.insertRow(0);
    columnHeaders.insertCell(CertificationsTableColumns.THERAPY_TYPE).innerText = "Therapy Type";
    columnHeaders.insertCell(CertificationsTableColumns.CERT_NAME).innerText = "Certification Name";
    columnHeaders.insertCell(CertificationsTableColumns.CERT_DEFINITION).innerText = "Certification Definition";

    document.getElementById("certificationsDiv").appendChild(table);
    certificationsTableShown = true;
    certificationsTable = table;
}

/**
 * Adds a certificate to the certifications table
 * 
 * @param therapyType the type of therapy
 * @param certName the name of the certificate
 * @param certDef the definition of the certification
 * 
 * @return none
 */
function AddCertificate(therapyType, certName, certDef)
{
    var newRow = certificationsTable.insertRow();
    newRow.insertCell(CertificationsTableColumns.THERAPY_TYPE).innerText = therapyType;
    newRow.insertCell(CertificationsTableColumns.CERT_NAME).innerText = certName;
    newRow.insertCell(CertificationsTableColumns.CERT_DEFINITION).innerText = certDef;
}

/**
 * Deletes the certifications table
 * 
 * @return none
 */
function DeleteTheTable()
{
    certificationsTableShown = false;
    document.getElementById("certificationsDiv").removeChild(certificationsTable);
}



function changePassword() {
	
	const newUsername = document.getElementById("newUsername").value
	const newPassword = document.getElementById("newPassword").value;
	
	console.log(newUsername);
	console.log(newPassword);
	
	fetch("/api/user/change-password", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ newUsername, newPassword })
	})
	.then(response => response.json())
	.then(data => {
		if (data.success) {
			let message = "";
			
			if(newUsername) {
				message += `Username changed to ${newUsername}`;
			}
			if(newPassword) {
				if (message) {
					message += " and ";
				}
				message += `password changed to ${newPassword}`;
			}
			document.getElementById("passwordMessage").innerText = ".";			
		} else {
			document.getElementById("passwordMessage").innerText = data.message || "Password change failed.";
		}
	})
	.catch(error => {
		document.getElementById("passwordMessage").innerText = "An error occurred.";
		console.error("Error:", error);
	});
}

