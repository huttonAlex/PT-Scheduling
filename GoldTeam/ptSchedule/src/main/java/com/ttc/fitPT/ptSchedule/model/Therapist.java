package com.ttc.fitPT.ptSchedule.model;


/**
 * Represents a Therapist, including personal details, contact information, and associated data such as ratings and appointments.
 */
public class Therapist {


	private int personId;
	private String firstName;
	private String lastName;
	private String email;
	private String phone;
	private boolean hasAppt;
	private int therapistId;
	private int numRatings;
	private int rating;


	/**
 	* Constructs a new Therapist object with detailed information.
 	*
 	* @param personId   the unique identifier for the person.
 	* @param therapistId the unique identifier for the therapist.
 	* @param firstName  the first name of the therapist.
 	* @param lastName   the last name of the therapist.
 	* @param email  	the email address of the therapist.
 	* @param phone  	the phone number of the therapist.
 	* @param hasAppt	whether the therapist has a new appointment.
 	*/
	public Therapist(int personId, int therapistId, String firstName, String lastName, String email, String phone, boolean hasAppt) {
    	this.personId = personId;
    	this.therapistId = therapistId;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.email = email;
    	this.phone = phone;
    	this.hasAppt = hasAppt;
	}


	/**
 	* Constructs a new Therapist object with basic information.
 	*
 	* @param personId  the unique identifier for the person.
 	* @param firstName the first name of the therapist.
 	* @param lastName  the last name of the therapist.
 	*/
	public Therapist(int personId, String firstName, String lastName) {
    	this.personId = personId;
    	this.firstName = firstName;
    	this.lastName = lastName;
	}


	/**
 	* Constructs a new Therapist object with a name only.
 	*
 	* @param firstName the first name of the therapist.
 	* @param lastName  the last name of the therapist.
 	*/
	public Therapist(String firstName, String lastName) {
    	this.firstName = firstName;
    	this.lastName = lastName;
	}


	// --- Getters and Setters ---


	public int getPersonId() {
    	return personId;
	}


	public void setPersonId(int personId) {
    	this.personId = personId;
	}


	public String getFirstName() {
    	return firstName;
	}


	public void setFirstName(String firstName) {
    	this.firstName = firstName;
	}


	public String getLastName() {
    	return lastName;
	}


	public void setLastName(String lastName) {
    	this.lastName = lastName;
	}


	public String getEmail() {
    	return email;
	}


	public void setEmail(String email) {
    	this.email = email;
	}


	public String getPhone() {
    	return phone;
	}


	public void setPhone(String phone) {
    	this.phone = phone;
	}


	public boolean getHasAppt() {
    	return hasAppt;
	}


	public void setHasAppt(boolean hasAppt) {
    	this.hasAppt = hasAppt;
	}


	public int getTherapistId() {
    	return therapistId;
	}


	public void setTherapistId(int therapistId) {
    	this.therapistId = therapistId;
	}


	public int getNumRatings() {
    	return numRatings;
	}


	public void setNumRatings(int numRatings) {
    	this.numRatings = numRatings;
	}


	public int getRating() {
    	return rating;
	}


	public void setRating(int rating) {
    	this.rating = rating;
	}


	// --- Overrides ---


	/**
 	* Provides a string representation of the Therapist object.
 	*
 	* @return a string containing the therapist's details.
 	*/
	@Override
	public String toString() {
    	return "Therapist {" +
            	"personId=" + personId +
            	", firstName='" + firstName + '\'' +
            	", lastName='" + lastName + '\'' +
            	", email='" + email + '\'' +
            	", phone='" + phone + '\'' +
            	", hasNewAppointment=" + hasAppt +
            	", therapistId=" + therapistId +
            	", numRatings=" + numRatings +
            	", rating=" + rating +
            	'}';
	}
}
