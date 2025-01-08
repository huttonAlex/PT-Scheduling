package com.ttc.fitPT.ptSchedule.controller;


import com.ttc.fitPT.ptSchedule.service.TherapistService;
import com.ttc.fitPT.ptSchedule.model.Therapist;
import jakarta.servlet.http.HttpSession;
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
 * TherapistController handles endpoints related to therapists' schedules, availability,
 * and reviews.
 */
@Controller
@RequestMapping("/api/therapist")
public class TherapistController {


	@Autowired
	private TherapistService therapistScheduleService;


	/**
 	* Displays the therapist's availability page.
 	*
 	* @return the name of the HTML template for availability.
 	*/
	@GetMapping("/availability")
	public String showAvailabilityPage() {
    	return "therapistAvailability";
	}


	/**
 	* Saves a therapist's availability schedule.
 	*
 	* @param availabilityData the schedule data, including dates, start time, and end time.
 	* @param session      	the current user's session to identify the therapist.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/availability")
	public ResponseEntity<String> saveAvailability(@RequestBody Map<String, Object> availabilityData, HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Therapist not found in session");
        	}
        	@SuppressWarnings("unchecked")
        	List<String> dates = (List<String>) availabilityData.get("dates");
        	LocalTime startTime = LocalTime.parse((String) availabilityData.get("startTime"));
        	LocalTime endTime = LocalTime.parse((String) availabilityData.get("endTime"));


        	for (String dateStr : dates) {
            	LocalDate date = LocalDate.parse(dateStr);
            	therapistScheduleService.addTherapistAvailability(therapist.getPersonId(), date, startTime, endTime);
        	}
        	return ResponseEntity.ok("Availability saved successfully.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving availability: " + e.getMessage());
    	}
	}


	/**
 	* Retrieves the therapist's existing schedule.
 	*
 	* @param session the current user's session to identify the therapist.
 	* @return a list of schedule entries for the therapist.
 	*/
	@GetMapping("/schedule-dates")
	public ResponseEntity<List<Map<String, Object>>> getTherapistSchedule(HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	List<Map<String, Object>> schedule = therapistScheduleService.getScheduleByTherapist(therapist.getPersonId());
        	return ResponseEntity.ok(schedule);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Retrieves the IDs of the therapist's schedule entries within the next 30 days.
 	*
 	* @param session the current user's session to identify the therapist.
 	* @return a list of schedule IDs.
 	*/
	@GetMapping("/schedule-ids")
	public ResponseEntity<List<Integer>> getTherapistScheduleIds(HttpSession session) {
    	Therapist therapist = (Therapist) session.getAttribute("therapist");
    	List<Integer> scheduleIds = therapistScheduleService.getScheduleIdsWithin30Days(therapist.getTherapistId());
    	return ResponseEntity.ok(scheduleIds);
	}


	/**
 	* Retrieves schedule information for a specific schedule ID.
 	*
 	* @param scheduleId the ID of the schedule entry.
 	* @return a map containing schedule details.
 	*/
	@GetMapping("/schedule-info")
	public ResponseEntity<Map<String, String>> getTherapistScheduleInfo(@RequestParam int scheduleId) {
    	Map<String, String> scheduleInfo = therapistScheduleService.getScheduleInformation(scheduleId);
    	return ResponseEntity.ok(scheduleInfo);
	}


	/**
 	* Sets the therapist's default schedule.
 	*
 	* @param scheduleData the default schedule data, including days of the week, start time, and end time.
 	* @param session  	the current user's session to identify the therapist.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/default-schedule")
	public ResponseEntity<String> setDefaultSchedule(@RequestBody Map<String, Object> scheduleData, HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Therapist not found in session");
        	}
        	@SuppressWarnings("unchecked")
        	List<String> daysOfWeek = (List<String>) scheduleData.get("daysOfWeek");
        	String startTime = (String) scheduleData.get("startTime");
        	String endTime = (String) scheduleData.get("endTime");


        	for (String day : daysOfWeek) {
            	therapistScheduleService.addDefaultSchedule(therapist.getPersonId(), day, startTime, endTime);
        	}
        	return ResponseEntity.ok("Default schedule set successfully.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error setting default schedule: " + e.getMessage());
    	}
	}


	/**
 	* Retrieves the therapist's default schedule.
 	*
 	* @param session the current user's session to identify the therapist.
 	* @return a list of default schedule entries.
 	*/
	@GetMapping("/default-schedule")
	public ResponseEntity<List<Map<String, String>>> getDefaultSchedule(HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        	}
        	List<Map<String, String>> defaultSchedule = therapistScheduleService.getDefaultSchedule(therapist.getPersonId());
        	return ResponseEntity.ok(defaultSchedule);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Modifies the therapist's availability.
 	*
 	* @param availabilityData the new availability data.
 	* @param session      	the current user's session to identify the therapist.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/modify-availability")
	public ResponseEntity<String> modifyAvailability(@RequestBody Map<String, Object> availabilityData, HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Therapist not found in session");
        	}


        	String dateStr = (String) availabilityData.get("date");
        	LocalDate date = LocalDate.parse(dateStr);
        	LocalTime newStartTime = LocalTime.parse((String) availabilityData.get("startTime"));
        	LocalTime newEndTime = LocalTime.parse((String) availabilityData.get("endTime"));


        	boolean success = therapistScheduleService.submitLeaveRequest(
            	therapist.getPersonId(), date, null, null, newStartTime, newEndTime
        	);


        	if (success) {
            	return ResponseEntity.ok("Leave request submitted successfully.");
        	} else {
            	return ResponseEntity.status(HttpStatus.CONFLICT).body("Cannot submit leave request due to conflicting appointments.");
        	}
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error submitting leave request: " + e.getMessage());
    	}
	}


	/**
 	* Retrieves modified availability within a specified date range.
 	*
 	* @param startDate the start date of the range.
 	* @param endDate   the end date of the range.
 	* @param session   the current user's session to identify the therapist.
 	* @return a list of modified availability entries.
 	*/
	@GetMapping("/modified-availability")
	public ResponseEntity<List<Map<String, String>>> getModifiedAvailability(
        	@RequestParam String startDate,
        	@RequestParam String endDate,
        	HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        	}
        	LocalDate start = LocalDate.parse(startDate);
        	LocalDate end = LocalDate.parse(endDate);
        	List<Map<String, String>> modifiedAvailability = therapistScheduleService.getModifiedAvailability(therapist.getPersonId(), start, end);
        	return ResponseEntity.ok(modifiedAvailability);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Retrieves appointments for the specified month and year.
 	*
 	* @param month   the month of the appointments.
 	* @param year	the year of the appointments.
 	* @param session the current user's session to identify the therapist.
 	* @return a list of appointments for the month.
 	*/
	@GetMapping("/appointments")
	public ResponseEntity<List<Map<String, String>>> getAppointmentsForMonth(
        	@RequestParam String month,
        	@RequestParam String year,
        	HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        	}
        	int m = Integer.parseInt(month);
        	int y = Integer.parseInt(year);
        	LocalDate startDate = LocalDate.of(y, m, 1);
        	LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        	List<Map<String, String>> appointments = therapistScheduleService.getAppointmentsForMonth(therapist.getPersonId(), startDate, endDate);
        	return ResponseEntity.ok(appointments);
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
    	}
	}


	/**
 	* Acknowledges new appointments for the therapist.
 	*
 	* @param session the current user's session to identify the therapist.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/acknowledge-new-appointments")
	@ResponseBody
	public ResponseEntity<String> acknowledgeNewAppointments(HttpSession session) {
    	Therapist therapist = (Therapist) session.getAttribute("therapist");


    	if (therapist == null) {
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Therapist not logged in.");
    	}


    	try {
        	therapistScheduleService.updateTherapistAppointments(therapist.getTherapistId());
        	therapist.setHasAppt(false);
        	session.setAttribute("therapist", therapist);
        	return ResponseEntity.ok("New appointments acknowledged.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error acknowledging appointments.");
    	}
	}


	/**
 	* Cancels a therapist's availability for a specific time slot.
 	*
 	* @param availabilityData the availability details to be canceled.
 	* @param session      	the current user's session to identify the therapist.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/cancel-availability")
	public ResponseEntity<String> cancelAvailability(@RequestBody Map<String, Object> availabilityData, HttpSession session) {
    	try {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist == null) {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Therapist not found in session");
        	}


        	String dateStr = (String) availabilityData.get("date");
        	LocalDate date = LocalDate.parse(dateStr);
        	LocalTime currentStartTime = LocalTime.parse((String) availabilityData.get("startTime"));
        	LocalTime currentEndTime = LocalTime.parse((String) availabilityData.get("endTime"));


        	therapistScheduleService.cancelLeaveRequest(therapist.getPersonId(), date, currentStartTime, currentEndTime);
        	return ResponseEntity.ok("Leave request canceled successfully.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error canceling leave request: " + e.getMessage());
    	}
	}


	/**
 	* Submits a rating for a therapist.
 	*
 	* @param therapistId the ID of the therapist being rated.
 	* @param rating  	the rating value.
 	* @return a ResponseEntity with a success or error message.
 	*/
	@PostMapping("/{therapistId}/rate")
	public ResponseEntity<String> addTherapistReview(
        	@PathVariable int therapistId,
        	@RequestParam(name = "rating") int rating) {
    	try {
        	therapistScheduleService.addTherapistReview(therapistId, rating);
        	return ResponseEntity.ok("Rating submitted successfully.");
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting rating: " + e.getMessage());
    	}
	}


	/**
 	* Retrieves a list of all therapists.
 	*
 	* @return a list of therapists.
 	*/
	@GetMapping("/therapists")
	public ResponseEntity<List<Therapist>> getTherapists() {
    	List<Therapist> therapists = therapistScheduleService.getTherapists();
    	return ResponseEntity.ok(therapists);
	}
}