package com.ttc.fitPT.ptSchedule.service;


import com.ttc.fitPT.ptSchedule.model.Appointment;
import com.ttc.fitPT.ptSchedule.model.Therapist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;


/**
 * ScheduleService provides functionalities to manage appointments, patients,
 * and therapist availability within the system.
 */
@Service
public class ScheduleService {


	@Autowired
	private JdbcTemplate jdbcTemplate;


	// ----------------------------
	// Appointment-related Methods
	// ----------------------------


	/**
 	* Adds a new appointment to the schedule.
 	*
 	* @param therapistId ID of the therapist.
 	* @param date    	The date of the appointment.
 	* @param time    	The start time of the appointment.
 	* @param therapyType The type of therapy.
 	* @param notes   	Additional notes for the appointment.
 	* @return A success or error message.
 	*/
	public String addAppointment(int therapistId, LocalDate date, String time, String therapyType, String notes) {
    	String sql = "CALL CREATE_APPOINTMENT(NULL, ?, ?, ?, ?, ?)";
    	int result = jdbcTemplate.update(sql, therapistId, date, time, therapyType, notes);
    	return result == 1 ? "Appointment successfully added" : "Error adding appointment";
	}


	/**
 	* Modifies an existing appointment.
 	*
 	* @param appointmentId The appointment ID.
 	* @param date      	New date for the appointment.
 	* @param startTime 	New start time for the appointment.
 	* @param therapyType   New therapy type.
 	* @param therapistId   New therapist ID.
 	* @param notes     	New notes for the appointment.
 	* @return A success or error message.
 	*/
	public String modifyAppointment(int appointmentId, LocalDate date, String startTime, String therapyType,
                                 	int therapistId, String notes) {
    	String sql = "CALL MODIFY_APPOINTMENT(?, ?, ?, ?, ?, ?)";
    	int result = jdbcTemplate.update(sql, appointmentId, date, startTime, therapyType, therapistId, notes);
    	return result == 1 ? "Appointment successfully modified" : "Error modifying appointment";
	}


	/**
 	* Cancels an appointment.
 	*
 	* @param appointmentId The appointment ID.
 	* @return A success or error message.
 	*/
	public String cancelAppointment(int appointmentId) {
    	String sql = "CALL CANCEL_APPOINTMENT(?)";
    	int result = jdbcTemplate.update(sql, appointmentId);
    	return result == 1 ? "Appointment successfully canceled" : "Error canceling appointment";
	}


	/**
 	* Retrieves appointment information by appointment ID.
 	*
 	* @param appointmentId The appointment ID.
 	* @return An Appointment object or null if not found.
 	*/
	public Appointment getAppointmentById(int appointmentId) {
    	String sql = "SELECT RETURN_PATIENT_APPTS(NULL, NULL, NULL, NULL, ?)";
    	String appointmentStr = jdbcTemplate.queryForObject(sql, String.class, appointmentId);
    	if (appointmentStr == null || appointmentStr.equalsIgnoreCase("NOT A VALID APPOINTMENT ID")
            	|| appointmentStr.equalsIgnoreCase("NO APPOINTMENT INFORMATION FOUND FOR PROVIDED PATIENT INFORMATION")) {
        	return null;
    	}
    	return parseSingleAppointmentString(appointmentStr);
	}


	/**
 	* Retrieves appointments for a specific month.
 	*
 	* @param year  The year of the appointments.
 	* @param month The month of the appointments (1-12).
 	* @return A list of Appointment objects.
 	*/
	public List<Appointment> getAppointmentsForMonth(int year, int month) {
    	LocalDate startDate = LocalDate.of(year, month, 1);
    	LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
    	String sqlGetIds = "SELECT RETURN_APPT_IDS(NULL, ?, ?)";
    	String appointmentIdsStr = jdbcTemplate.queryForObject(sqlGetIds, String.class, startDate, endDate);


    	List<Integer> appointmentIds = parseAppointmentIds(appointmentIdsStr);
    	List<Appointment> appointments = new ArrayList<>();


    	for (int appointmentId : appointmentIds) {
        	Appointment appointment = getAppointmentById(appointmentId);
        	if (appointment != null && appointment.getTherapistId() != 0) {
            	appointments.add(appointment);
        	}
    	}
    	return appointments;
	}


	/**
 	* Retrieves conflicting appointments for a specific month.
 	*
 	* @param year  The year of the appointments.
 	* @param month The month of the appointments (1-12).
 	* @return A list of conflicting Appointment objects.
 	*/
	public List<Appointment> getConflictingAppointmentsByMonth(int year, int month) {
    	List<Integer> conflictingAppointmentIds = getConflictingAppointmentIds();
    	List<Appointment> appointments = new ArrayList<>();
    	for (int appointmentId : conflictingAppointmentIds) {
        	Appointment appointment = getAppointmentById(appointmentId);
        	if (appointment != null && appointment.getScheduleDay().getYear() == year
                	&& appointment.getScheduleDay().getMonthValue() == month) {
            	appointments.add(appointment);
        	}
    	}
    	return appointments;
	}


	// ----------------------------
	// Patient-related Methods
	// ----------------------------


	/**
 	* Adds a new patient to the system.
 	*
 	* @param firstName The first name of the patient.
 	* @param lastName  The last name of the patient.
 	* @param email 	The email address of the patient.
 	* @param phone 	The phone number of the patient.
 	* @param notes 	Additional notes for the patient.
 	*/
	public void addPatient(String firstName, String lastName, String email, String phone, String notes) {
    	String sql = "CALL ADD_PERSON(?, ?, 'PATIENT', ?, ?, ?)";
    	jdbcTemplate.update(sql, firstName, lastName, email, phone, notes);
	}


	/**
 	* Retrieves patient information.
 	*
 	* @return Patient info as a string.
 	*/
	public String getPatientInfo() {
    	String sql = "SELECT GET_PATIENT_INFO(NULL)";
    	return jdbcTemplate.queryForObject(sql, String.class);
	}


	/**
 	* Retrieves patient information by patient ID.
 	*
 	* @param patientId The patient ID.
 	* @return Patient info as a string.
 	*/
	public String getPatientInfo(int patientId) {
    	String sql = "SELECT GET_PATIENT_INFO(?)";
    	return jdbcTemplate.queryForObject(sql, String.class, patientId);
	}


	/**
 	* Finds appointments based on patient information.
 	*
 	* @param firstName Patient's first name.
 	* @param lastName  Patient's last name.
 	* @param email 	Patient's email.
 	* @param phone 	Patient's phone.
 	* @return A list of Appointment objects.
 	*/
	public List<Appointment> findAppointments(String firstName, String lastName, String email, String phone) {
    	String sql = "SELECT RETURN_PATIENT_APPTS(?, ?, ?, ?, NULL)";
    	String apptStr = jdbcTemplate.queryForObject(sql, String.class, firstName, lastName, email, phone);
    	return parseAppointmentString(apptStr);
	}


	// ----------------------------
	// Therapist-related Methods
	// ----------------------------


	/**
 	* Retrieves available therapists based on therapy type, date, and time.
 	*
 	* @param therapyType The type of therapy.
 	* @param date    	The date for the appointment.
 	* @param time    	The time for the appointment.
 	* @return A list of available Therapist objects.
 	*/
	public List<Therapist> getAvailableTherapists(String therapyType, LocalDate date, LocalTime time) {
    	String loadTherapistsSql = "CALL GET_THERAPISTS_PROC(?, ?, ?)";
    	jdbcTemplate.update(loadTherapistsSql, therapyType, date, time);


    	String getTherapistsSql = "SELECT GET_THERAPISTS()";
    	String therapistsStr = jdbcTemplate.queryForObject(getTherapistsSql, String.class);
    	return parseTherapistString(therapistsStr);
	}


	// ----------------------------
	// Parsing Methods
	// ----------------------------


	private List<Therapist> parseTherapistString(String therapistsStr) {
    	List<Therapist> therapistList = new ArrayList<>();
    	if (therapistsStr != null && !therapistsStr.isEmpty()) {
        	String[] therapistEntries = therapistsStr.split(",");
        	for (String entry : therapistEntries) {
            	String[] details = entry.trim().split(" ");
            	if (details.length == 3) {
                	therapistList.add(new Therapist(Integer.parseInt(details[0]), details[1], details[2]));
            	}
        	}
    	}
    	return therapistList;
	}


	private List<Appointment> parseAppointmentString(String apptStr) {
    	List<Appointment> appointments = new ArrayList<>();
    	if (apptStr != null && !apptStr.isEmpty()) {
        	String[] apptEntries = apptStr.split(";");
        	for (String entry : apptEntries) {
            	Appointment appointment = parseSingleAppointmentString(entry);
            	if (appointment != null) {
                	appointments.add(appointment);
            	}
        	}
    	}
    	return appointments;
	}


	private Appointment parseSingleAppointmentString(String apptInfoStr) {
    	if (apptInfoStr != null && !apptInfoStr.isEmpty()) {
        	String[] details = apptInfoStr.split(",");
        	if (details.length >= 12) {
            	return new Appointment(
                    	Integer.parseInt(details[7].trim()),
                    	details[0].trim(),
                    	details[1].trim(),
                    	details[0].trim() + " " + details[1].trim(),
                    	details[2].trim(),
                    	details[3].trim(),
                    	Integer.parseInt(details[4].trim()),
                    	details[5].trim(),
                    	details[6].trim(),
                    	LocalDate.parse(details[8].trim()),
                    	LocalTime.parse(details[9].trim()),
                    	LocalTime.parse(details[10].trim()),
                    	details[11].trim()
            	);
        	}
    	}
    	return null;
	}


	private List<Integer> parseAppointmentIds(String appointmentIdsStr) {
    	List<Integer> ids = new ArrayList<>();
    	if (appointmentIdsStr != null && !appointmentIdsStr.isEmpty() && !appointmentIdsStr.equalsIgnoreCase("NO IDS FOUND")) {
        	String[] idsArray = appointmentIdsStr.split(",");
        	for (String idStr : idsArray) {
            	ids.add(Integer.parseInt(idStr.trim()));
        	}
    	}
    	return ids;
	}


	public List<Integer> getConflictingAppointmentIds() {
    	String sql = "SELECT RETURN_CONFLICTING_APPT_IDS()";
    	String appointmentIdsStr = jdbcTemplate.queryForObject(sql, String.class);
    	return parseAppointmentIds(appointmentIdsStr);
	}


	public void modifyPatient(int patientId, String newFirstName, String newLastName, String newPhoneNumber, String newEmail, String newPatientNotes) {
    	String sql = "CALL MODIFY_PATIENT(?, ?, ?, ?, ?, ?)";
    	jdbcTemplate.update(sql, patientId, newFirstName, newLastName, newPhoneNumber, newEmail, newPatientNotes);
	}


	public int findPatientId(String firstName, String lastName, String email, String phone) {
    	String sql = "SELECT FIND_PATIENT(?, ?, ?, ?)";
    	Integer patientId = jdbcTemplate.queryForObject(sql, Integer.class, firstName, lastName, email, phone);
    	if (patientId != null) {
        	return patientId;
    	} else {
        	throw new IllegalArgumentException("Patient not found with the provided information.");
    	}
	}
}






