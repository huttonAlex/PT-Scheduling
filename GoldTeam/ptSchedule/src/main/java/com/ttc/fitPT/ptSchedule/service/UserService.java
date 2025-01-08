package com.ttc.fitPT.ptSchedule.service;


import com.ttc.fitPT.ptSchedule.model.Therapist;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.stereotype.Service;


import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;


/**
 * UserService provides functionalities related to user profile management,
 * including fetching user details, changing passwords, and retrieving therapist certifications.
 */
@Service
public class UserService {


	private final JdbcTemplate jdbcTemplate;


	/**
 	* Constructor for UserService.
 	*
 	* @param jdbcTemplate the JdbcTemplate instance used for database interactions.
 	*/
	@Autowired
	public UserService(JdbcTemplate jdbcTemplate) {
    	this.jdbcTemplate = jdbcTemplate;
	}


	/**
 	* Fetches user details based on the user's role and adds relevant information to a map.
 	* This includes basic details for all users and specific details if the user is a therapist.
 	*
 	* @param session the current user session containing role and identification information.
 	* @return a map containing user information, such as role, full name, and specific details for therapists.
 	*/
	public Map<String, Object> getUserDetails(HttpSession session) {
    	Map<String, Object> userDetails = new HashMap<>();


    	// Retrieve role and full name from session
    	String role = (String) session.getAttribute("role");
    	String firstName = (String) session.getAttribute("firstName");
    	String lastName = (String) session.getAttribute("lastName");
    	Integer personId = (Integer) session.getAttribute("personId");
    	String roleId = (String) session.getAttribute("roleId");
    	String email = (String) session.getAttribute("email");
    	String phone = (String) session.getAttribute("phone");


    	String fullName = firstName + " " + lastName;


    	// Add basic details to userDetails map
    	userDetails.put("role", role);
    	userDetails.put("fullName", fullName);
    	userDetails.put("roleId", roleId);
    	userDetails.put("personId", personId);
    	userDetails.put("email", email);
    	userDetails.put("phone", phone);


    	// Add additional therapist-specific details
    	if ("THERAPIST".equalsIgnoreCase(role)) {
        	Therapist therapist = (Therapist) session.getAttribute("therapist");
        	if (therapist != null) {
            	userDetails.put("phoneNumber", therapist.getPhone());
            	userDetails.put("email", therapist.getEmail());
            	userDetails.put("hasAppointment", therapist.getHasAppt());
            	try {
                	List<Map<String, String>> certifications = getTherapistCertifications(personId);
                	userDetails.put("therapistCertifications", certifications);
            	} catch (Exception e) {
                	e.printStackTrace();
            	}
        	}
    	}
    	return userDetails;
	}


	/**
 	* Changes the password or username for a specified user.
 	*
 	* @param personId	the unique identifier of the user whose details are being updated.
 	* @param newUsername the new username to set (nullable).
 	* @param newPassword the new password to set (nullable).
 	* @return true if the details were updated successfully, false otherwise.
 	*/
	public boolean changeUserPassword(int personId, String newUsername, String newPassword) {
    	String sql = "CALL EDIT_PERSON(?, NULL, NULL, ?, ?, NULL, NULL)";
    	jdbcTemplate.update(sql, personId, newUsername, newPassword);
    	return true;
	}


	/**
 	* Retrieves certifications for a specified therapist by therapist ID.
 	* Each certification includes abbreviation, description, and therapy type.
 	*
 	* @param therapistId the unique identifier of the therapist.
 	* @return a list of maps, each containing certification details (abbreviation, description, and therapy type).
 	* @throws Exception if the stored procedure call fails or returns invalid data.
 	*/
	public List<Map<String, String>> getTherapistCertifications(int therapistId) throws Exception {
    	Map<String, Object> result = jdbcTemplate.call(
            	new CallableStatementCreator() {
                	@Override
                	public CallableStatement createCallableStatement(Connection con) throws SQLException {
                    	CallableStatement cs = con.prepareCall("{CALL GET_THERAPIST_CERTS(?, ?)}");
                    	cs.setInt(1, therapistId); // IN parameter
                    	cs.registerOutParameter(2, Types.VARCHAR); // OUT parameter
                    	return cs;
                	}
            	},
            	Arrays.asList(
                    	new SqlParameter("therapistId", Types.INTEGER), // Declare IN parameter
                    	new SqlOutParameter("CERT_STRING", Types.VARCHAR) // Declare OUT parameter
            	)
    	);


    	String certString = (String) result.get("CERT_STRING");
    	if (certString == null) {
        	certString = (String) result.get("2"); // Fallback in case CERT_STRING isn't found
    	}
    	if (certString == null) {
        	System.out.println("Available keys: " + result.keySet());
        	throw new Exception("Out parameter 'CERT_STRING' not found in the result");
    	}


    	// Handle cases where the result indicates invalid or no data
    	if (certString.equals("NO CERTS FOUND") || certString.equals("NOT A VALID THERAPIST ID")) {
        	return new ArrayList<>();
    	}


    	// Split the returned certification abbreviations
    	String[] certAbbrList = certString.split(", ");
    	List<Map<String, String>> certDetails = new ArrayList<>();


    	for (String certAbbr : certAbbrList) {
        	Map<String, String> certData = new HashMap<>();


        	// Fetch additional details for each certification abbreviation
        	String certInfo = jdbcTemplate.queryForObject("SELECT GET_CERT_INFO(?)", String.class, certAbbr.trim());
        	if (certInfo != null) {
            	String[] infoParts = certInfo.split(", ");
            	if (infoParts.length == 3) {
                	certData.put("certAbbr", infoParts[0]);
                	certData.put("certDescription", infoParts[1]);
                	certData.put("therapyType", infoParts[2]);
            	}
        	}
        	certDetails.add(certData);
    	}


    	return certDetails;
	}
}






