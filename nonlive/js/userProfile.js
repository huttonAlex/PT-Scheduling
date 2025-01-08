/**
 *  Enumerator for the user roles.
 */
const Roles = Object.freeze
({
    SCHEDULER: "SCHEDULER",
    THERAPIST: "THERAPIST",
    ADMINISTRATOR: "ADMINISTRATOR"
});

/**
 * Enumerator for the certifications table columns.
 */
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
function LoadUserData()
{
    //Grab the type of user then load the necessary functions to spawn the certifications table for the therapist & then tables / buttons for admin

    /*
        Placeholder for determining the role of the user. Remove when connection to DB is made.
        These are only displaying the different user types (Scheduler, therapist, admin)
    */
    // user = person1;
    user = person2;
    // user = person3;

    document.getElementById("nameOfUser").innerText = user.firstName + " " + user.lastName;
    document.getElementById("userId").innerText = "User ID: " + user.personId;

    switch(user.personType)
    {
        case Roles.SCHEDULER:
            LoadSchedulerData();
            break;

        case Roles.THERAPIST:
            LoadTherapistData();
            break;

        case Roles.ADMINISTRATOR:
            LoadAdminData();
            break;
    }
}

/**
 * Loads and sets scheduler data and fields.
 * 
 * @return none
 */
function LoadSchedulerData()
{
    userRoleData = scheduler1;
    document.getElementById("roleId").innerText = "Scheduler ID: " + userRoleData.schedulerId;
}

/**
 * Loads and sets therapist data and fields.
 * 
 * @return none
 */
function LoadTherapistData()
{
    // Grab all entries for therapists' certifications
    let certifications = [certification1];
    userRoleData = therapist1;

    document.getElementById("email").innerText = "Email: " + userRoleData.email;
    document.getElementById("phoneNumber").innerText = "Phone Number: " + userRoleData.phone;
    document.getElementById("roleId").innerText = "Therapist ID: " + userRoleData.therapistId;
    
    //If the therapist does not have certifications, this ensures the table does not get created.
    if (certifications.length == 0) return;
    
    CreateCertificationsTable();

    certifications.forEach(therapistCertification =>
    {
        AddCertificate(therapistCertification.therapyType, therapistCertification.certName, therapistCertification.certDef);
    })
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

/**
 * Loads and sets administrator data and fields.
 * 
 * @return none
 */
function LoadAdminData()
{
    userRoleData = admin1;
    document.getElementById("roleId").innerText = "Administrator ID: " + userRoleData.adminId;
}

