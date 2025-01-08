package com.ttc.fitPT.ptSchedule.controller;


import com.ttc.fitPT.ptSchedule.model.Appointment;
import com.ttc.fitPT.ptSchedule.model.Therapist;
import com.ttc.fitPT.ptSchedule.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;


/**
 * SchedulerController handles requests related to scheduling appointments,
 * managing therapists, and patient data.
 */
@Controller
@RequestMapping("/api/scheduler")
public class SchedulerController {


	@Autowired
	private ScheduleService scheduleService;


	/**
 	* Renders the schedule page.
 	*
 	* @return the name of the HTML template for the schedule page.
 	*/
	@GetMapping("/schedule")
	public String showSchedulePage() {
    	return "scheduler_schedule";
	}


	/**
 	* Fetches a list of available therapists based on therapy type, date, and time.
 	*
 	* @param therapyType the type of therapy required.
 	* @param dateStr 	the date of the appointment (format: YYYY-MM-DD).
 	* @param timeStr 	the time of the appointment (format: HH:MM).
 	* @return a ResponseEntity containing a list of available therapists or a bad request status.
 	*/
	@GetMapping("/available-therapists")
	@ResponseBody
	public ResponseEntity<List<Therapist>> getAvailableTherapists(
        	@RequestParam("therapyType") String therapyType,
        	@RequestParam("date") String dateStr,
        	@RequestParam("time") String timeStr) {
    	try {
        	LocalDate date = LocalDate.parse(dateStr);
        	LocalTime time = LocalTime.parse(timeStr);
        	List<Therapist> availableTherapists = scheduleService.getAvailableTherapists(therapyType, date, time);
        	return ResponseEntity.ok(availableTherapists);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Adds a new appointment.
 	*
 	* @param appointmentData a map containing appointment details.
 	* @return a ResponseEntity with appointment details or an error message.
 	*/
	@PostMapping("/add-appointment")
	@ResponseBody
	public ResponseEntity<String> addAppointment(@RequestBody Map<String, String> appointmentData) {
    	try {
        	int therapistId = Integer.parseInt(appointmentData.get("therapistId"));
        	LocalDate date = LocalDate.parse(appointmentData.get("date"));
        	String time = appointmentData.get("time").length() == 5 ? appointmentData.get("time") + ":00" : appointmentData.get("time");
        	String therapyType = appointmentData.get("therapyType");
        	String notes = appointmentData.getOrDefault("notes", "");


        	scheduleService.addAppointment(therapistId, date, time, therapyType, notes);
        	String patientInfo = scheduleService.getPatientInfo();


        	String[] patientDetails = patientInfo.split(",");
        	String formattedInfo = String.format(
            	"Appointment successfully created for:%nPatient: %s %s%nEmail: %s%nPhone: %s%nNotes: %s%nTherapy Type: %s%nDate: %s%nTime: %s",
            	patientDetails[0], patientDetails[1], patientDetails[2], patientDetails[3], patientDetails[4], therapyType, date, time
        	);


        	return ResponseEntity.ok(formattedInfo);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Adds a new patient to the system.
 	*
 	* @param patientData a map containing patient details.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/add-patient")
	public ResponseEntity<String> addPatient(@RequestBody Map<String, String> patientData) {
    	try {
        	scheduleService.addPatient(
            	patientData.get("firstName"),
            	patientData.get("lastName"),
            	patientData.getOrDefault("email", null),
            	patientData.getOrDefault("phone", null),
            	patientData.getOrDefault("notes", null)
        	);
        	return ResponseEntity.ok("Patient added successfully.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
    	}
	}


	/**
 	* Finds appointments for a patient based on provided details.
 	*
 	* @param firstName the first name of the patient (optional).
 	* @param lastName  the last name of the patient (optional).
 	* @param email 	the email of the patient (optional).
 	* @param phone 	the phone number of the patient (optional).
 	* @return a ResponseEntity containing a list of appointments or a bad request status.
 	*/
	@GetMapping("/find-appointments")
	public ResponseEntity<List<Appointment>> findPatientAppointments(
        	@RequestParam(value = "firstName", required = false) String firstName,
        	@RequestParam(value = "lastName", required = false) String lastName,
        	@RequestParam(value = "email", required = false) String email,
        	@RequestParam(value = "phone", required = false) String phone) {
    	try {
        	List<Appointment> appointments = scheduleService.findAppointments(
            	firstName == null || firstName.isEmpty() ? null : firstName,
            	lastName == null || lastName.isEmpty() ? null : lastName,
            	email == null || email.isEmpty() ? null : email,
            	phone == null || phone.isEmpty() ? null : phone
        	);
        	return ResponseEntity.ok(appointments);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Modifies an existing appointment.
 	*
 	* @param requestData a map containing appointment and patient modification details.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/modify-appointment")
	public ResponseEntity<String> modifyAppointment(@RequestBody Map<String, Object> requestData) {
    	try {
        	int appointmentId = Integer.parseInt(requestData.get("appointmentId").toString());
        	LocalDate newDate = LocalDate.parse(requestData.get("newDate").toString());
        	String newTime = requestData.get("newTime").toString();
        	String newType = requestData.get("newType").toString();
        	int newTherapistId = Integer.parseInt(requestData.get("newTherapistId").toString());
        	String notes = requestData.getOrDefault("notes", "").toString();


        	int patientId = scheduleService.findPatientId(
            	requestData.get("originalPatientFirstName").toString(),
            	requestData.get("originalPatientLastName").toString(),
            	requestData.get("originalPatientEmail").toString(),
            	requestData.get("originalPatientPhone").toString()
        	);


        	scheduleService.modifyPatient(
            	patientId,
            	requestData.get("newPatientFirstName").toString(),
            	requestData.get("newPatientLastName").toString(),
            	requestData.get("newPatientPhone").toString(),
            	requestData.get("newPatientEmail").toString(),
            	null
        	);


        	String result = scheduleService.modifyAppointment(
            	appointmentId, newDate, newTime, newType, newTherapistId, notes
        	);


        	return ResponseEntity.ok(result);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error modifying appointment or patient information: " + e.getMessage());
    	}
	}


	/**
 	* Cancels an appointment by its ID.
 	*
 	* @param appointmentId the ID of the appointment to cancel.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@DeleteMapping("/cancel-appointment")
	public ResponseEntity<String> cancelAppointment(@RequestParam("appointmentId") int appointmentId) {
    	try {
        	String result = scheduleService.cancelAppointment(appointmentId);
        	return ResponseEntity.ok(result);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error canceling appointment: " + e.getMessage());
    	}
	}


	/**
 	* Retrieves appointments for a specific month and year.
 	*
 	* @param year  the year of the appointments.
 	* @param month the month of the appointments.
 	* @return a ResponseEntity containing a list of appointments or a bad request status.
 	*/
	@GetMapping("/appointments-by-month")
	public ResponseEntity<List<Appointment>> getAppointmentByMonth(
        	@RequestParam("year") int year,
        	@RequestParam("month") int month) {
    	try {
        	List<Appointment> appointments = scheduleService.getAppointmentsForMonth(year, month);
        	return ResponseEntity.ok(appointments);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Retrieves conflicting appointments for a specific month and year.
 	*
 	* @param year  the year of the appointments.
 	* @param month the month of the appointments.
 	* @return a ResponseEntity containing a list of conflicting appointments or an error status.
 	*/
	@GetMapping("/conflicting-appointments-by-month")
	public ResponseEntity<List<Appointment>> getConflictingAppointmentsByMonth(
        	@RequestParam("year") int year,
        	@RequestParam("month") int month) {
    	try {
        	List<Appointment> conflicts = scheduleService.getConflictingAppointmentsByMonth(year, month);
        	return ResponseEntity.ok(conflicts);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    	}
	}
}






