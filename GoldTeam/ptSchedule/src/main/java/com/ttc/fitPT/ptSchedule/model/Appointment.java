package com.ttc.fitPT.ptSchedule.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalTime;


/**
 * The `Appointment` class represents a scheduled appointment,
 * including details about the therapist, patient, and schedule.
 */
public class Appointment {


	@JsonProperty("therapistId")
	private int therapistId;


	@JsonProperty("therapistFullName")
	private String therapistFullName;


	@JsonProperty("scheduleDay")
	private LocalDate scheduleDay;


	@JsonProperty("startTime")
	private LocalTime startTime;


	@JsonProperty("endTime")
	private LocalTime endTime;


	@JsonProperty("therapyType")
	private String therapyType;


	@JsonProperty("patientId")
	private int patientId;


	@JsonProperty("appointmentId")
	private int appointmentId;


	@JsonProperty("notes")
	private String notes;


	@JsonProperty("patientName")
	private String patientName;


	@JsonProperty("firstName")
	private String firstName;


	@JsonProperty("lastName")
	private String lastName;


	@JsonProperty("phone")
	private String patientPhone;


	@JsonProperty("email")
	private String patientEmail;


	/**
 	* Constructor to create an appointment.
 	*
 	* @param appointmentId  	the unique identifier for the appointment.
 	* @param firstName      	the patient's first name.
 	* @param lastName       	the patient's last name.
 	* @param patientName    	the patient's full name (optional).
 	* @param patientEmail   	the patient's email address.
 	* @param patientPhone   	the patient's phone number.
 	* @param therapistId    	the therapist's ID.
 	* @param therapistFullName  the therapist's full name.
 	* @param therapyType    	the type of therapy.
 	* @param appointmentDate	the date of the appointment.
 	* @param startTime      	the start time of the appointment.
 	* @param endTime        	the end time of the appointment.
 	* @param notes          	additional notes for the appointment.
 	*/
	public Appointment(int appointmentId, String firstName, String lastName, String patientName, String patientEmail,
                   	String patientPhone, int therapistId, String therapistFullName, String therapyType,
                   	LocalDate appointmentDate, LocalTime startTime, LocalTime endTime, String notes) {
    	this.appointmentId = appointmentId;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.patientName = patientName;
    	this.patientEmail = patientEmail;
    	this.patientPhone = patientPhone;
    	this.therapistId = therapistId;
    	this.therapistFullName = therapistFullName;
    	this.therapyType = therapyType;
    	this.scheduleDay = appointmentDate;
    	this.startTime = startTime;
    	this.endTime = endTime;
    	this.notes = notes;
	}


	// --- Getters and Setters ---
	public int getTherapistId() {
    	return therapistId;
	}


	public void setTherapistId(int therapistId) {
    	this.therapistId = therapistId;
	}


	public String getTherapistFullName() {
    	return therapistFullName;
	}


	public void setTherapistFullName(String therapistFullName) {
    	this.therapistFullName = therapistFullName;
	}


	public LocalDate getScheduleDay() {
    	return scheduleDay;
	}


	public void setScheduleDay(LocalDate scheduleDay) {
    	this.scheduleDay = scheduleDay;
	}


	public LocalTime getStartTime() {
    	return startTime;
	}


	public void setStartTime(LocalTime startTime) {
    	this.startTime = startTime;
	}


	public LocalTime getEndTime() {
    	return endTime;
	}


	public void setEndTime(LocalTime endTime) {
    	this.endTime = endTime;
	}


	public String getTherapyType() {
    	return therapyType;
	}


	public void setTherapyType(String therapyType) {
    	this.therapyType = therapyType;
	}


	public int getPatientId() {
    	return patientId;
	}


	public void setPatientId(int patientId) {
    	this.patientId = patientId;
	}


	public int getAppointmentId() {
    	return appointmentId;
	}


	public void setAppointmentId(int appointmentId) {
    	this.appointmentId = appointmentId;
	}


	public String getNotes() {
    	return notes;
	}


	public void setNotes(String notes) {
    	this.notes = notes;
	}


	public String getPatientName() {
    	return patientName;
	}


	public void setPatientName(String patientName) {
    	this.patientName = patientName;
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


	public String getPatientPhone() {
    	return patientPhone;
	}


	public void setPatientPhone(String patientPhone) {
    	this.patientPhone = patientPhone;
	}


	public String getPatientEmail() {
    	return patientEmail;
	}


	public void setPatientEmail(String patientEmail) {
    	this.patientEmail = patientEmail;
	}


	// --- Overrides ---


	@Override
	public String toString() {
    	return "Appointment {" +
            	"appointmentId=" + appointmentId +
            	", patientId=" + patientId +
            	", therapistId=" + therapistId +
            	", scheduleDay=" + scheduleDay +
            	", startTime=" + startTime +
            	", endTime=" + endTime +
            	", therapyType='" + therapyType + '\'' +
            	", therapistFullName='" + therapistFullName + '\'' +
            	", notes='" + notes + '\'' +
            	", patientName='" + patientName + '\'' +
            	", firstName='" + firstName + '\'' +
            	", lastName='" + lastName + '\'' +
            	", patientPhone='" + patientPhone + '\'' +
            	", patientEmail='" + patientEmail + '\'' +
            	'}';
	}
}






