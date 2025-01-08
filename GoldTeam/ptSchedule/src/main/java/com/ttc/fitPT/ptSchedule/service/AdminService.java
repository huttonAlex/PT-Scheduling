package com.ttc.fitPT.ptSchedule.service;


import com.ttc.fitPT.ptSchedule.model.Certification;
import com.ttc.fitPT.ptSchedule.model.User;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


/**
 * AdminService provides functionality to manage users, therapists, and certifications.
 */
@Service
public class AdminService {


	@Autowired
	private JdbcTemplate jdbcTemplate;


	/**
 	* Retrieves a list of all users with basic information.
 	*
 	* @param sortBy 	the field to sort by (e.g., LAST_NAME).
 	* @param sortOrder  the sorting order (e.g., ASC or DESC).
 	* @param personType the type of person to filter by (optional).
 	* @return a list of users.
 	*/
	@SuppressWarnings("deprecation")
	public List<User> getAllUsers(String sortBy, String sortOrder, String personType) {
    	sortBy = "LAST_NAME";
    	sortOrder = "ASC";
    	String query = "SELECT RETURN_USER_TABLE(?, ?, NULL)";
    	String result = jdbcTemplate.queryForObject(query, new Object[]{sortBy, sortOrder}, String.class);


    	if (result == null || result.isEmpty()) {
        	return List.of();
    	}


    	List<User> users = new ArrayList<>();
    	String[] userRows = result.split("; ");


    	for (String row : userRows) {
        	String[] userData = row.split(", ");
        	int personId = Integer.parseInt(userData[0]);
        	String firstName = userData[1];
        	String lastName = userData[2];
        	String roleType = userData[3];
        	String username = userData[4];
        	String password = userData[5];


        	String userInfoQuery = "SELECT RETURN_USER_INFO(?)";
        	String userInfoResult = jdbcTemplate.queryForObject(userInfoQuery, new Object[]{personId}, String.class);


        	if (userInfoResult != null) {
            	String[] userInfoData = userInfoResult.split(", ");
            	int roleId = Integer.parseInt(userInfoData[3]);
            	String email = userInfoData.length > 4 ? userInfoData[4] : null;
            	String phone = userInfoData.length > 5 ? userInfoData[5] : null;


            	users.add(new User(personId, firstName, lastName, roleType, roleId, email, phone, username, password));
        	}
    	}
    	return users;
	}


	/**
 	* Retrieves detailed therapist information by therapist ID.
 	*
 	* @param therapistId the ID of the therapist.
 	* @return a string containing the therapist's information.
 	*/
	@SuppressWarnings("deprecation")
	public String getTherapistInfo(int therapistId) {
    	String query = "SELECT RETURN_USER_INFO(?)";
    	return jdbcTemplate.queryForObject(query, new Object[]{therapistId}, String.class);
	}


	/**
 	* Retrieves certification information by its abbreviation.
 	*
 	* @param certAbbreviation the abbreviation of the certification.
 	* @return a string containing certification details.
 	*/
	@SuppressWarnings("deprecation")
	public String getCertificationInfo(String certAbbreviation) {
    	String query = "SELECT GET_CERT_INFO(?)";
    	return jdbcTemplate.queryForObject(query, new Object[]{certAbbreviation}, String.class);
	}


	/**
 	* Deletes a user by their ID.
 	*
 	* @param personId the ID of the user to be deleted.
 	*/
	public void deleteUser(int personId) {
    	String query = "CALL DELETE_PERSON(?)";
    	jdbcTemplate.update(query, personId);
	}


	/**
 	* Updates user information.
 	*
 	* @param personId  the ID of the user.
 	* @param firstName the new first name (optional).
 	* @param lastName  the new last name (optional).
 	* @param uName 	the new username (optional).
 	* @param pWord 	the new password (optional).
 	* @param email 	the new email address (optional).
 	* @param phone 	the new phone number (optional).
 	*/
	public void editUser(int personId, String firstName, String lastName, String uName, String pWord, String email, String phone) {
    	String query = "CALL EDIT_PERSON(?, ?, ?, ?, ?, ?, ?)";
    	jdbcTemplate.update(query, personId, firstName, lastName, uName, pWord, email, phone);
	}


	/**
 	* Adds a new user to the system.
 	*
 	* @param firstName  the user's first name.
 	* @param lastName   the user's last name.
 	* @param personType the type of user (e.g., Therapist, Scheduler, Admin).
 	* @param email  	the user's email address.
 	* @param phone  	the user's phone number.
 	*/
	public void addUser(String firstName, String lastName, String personType, String email, String phone) {
    	String query = "CALL ADD_PERSON(?, ?, ?, ?, ?, NULL)";
    	jdbcTemplate.update(query, firstName, lastName, personType.toUpperCase(), email, phone);
	}


	/**
 	* Adds a review rating for a therapist.
 	*
 	* @param therapistId the ID of the therapist.
 	* @param rating  	the rating to be added.
 	*/
	public void addTherapistReview(int therapistId, int rating) {
    	String query = "CALL ADD_THERAPIST_REVIEW(?, ?)";
    	jdbcTemplate.update(query, therapistId, rating);
	}


	/**
 	* Retrieves ratings for all therapists.
 	*
 	* @return a string containing therapist ratings.
 	*/
	public String getTherapistRatings() {
    	String query = "SELECT GET_THERAPIST_RATINGS()";
    	return jdbcTemplate.queryForObject(query, String.class);
	}


	/**
 	* Retrieves all certifications in the system.
 	*
 	* @return a list of certifications.
 	*/
	public List<Certification> getAllCertifications() {
    	String result = jdbcTemplate.queryForObject("SELECT GET_CERT_INFO(NULL)", String.class);
    	List<Certification> certifications = new ArrayList<>();


    	if (result != null && !result.isEmpty()) {
        	String[] certsArray = result.split("; ");
        	for (String certData : certsArray) {
            	String[] data = certData.split(", ");
            	if (data.length >= 3) {
                	certifications.add(new Certification(data[0], data[1], data[2]));
            	}
        	}
    	}
    	return certifications;
	}


	/**
 	* Retrieves certifications for a specific therapist.
 	*
 	* @param therapistId the ID of the therapist.
 	* @return a list of certification strings.
 	* @throws Exception if there is an error retrieving certifications.
 	*/
	public List<String> getTherapistCertifications(int therapistId) throws Exception {
    	Map<String, Object> result = jdbcTemplate.call(
        	new CallableStatementCreator() {
            	@Override
            	public CallableStatement createCallableStatement(Connection con) throws SQLException {
                	CallableStatement cs = con.prepareCall("{CALL GET_THERAPIST_CERTS(?, ?)}");
                	cs.setInt(1, therapistId);
                	cs.registerOutParameter(2, Types.VARCHAR);
                	return cs;
            	}
        	},
        	Arrays.asList(
            	new SqlParameter("therapistId", Types.INTEGER),
            	new SqlOutParameter("CERT_STRING", Types.VARCHAR)
        	)
    	);


    	String certString = (String) result.get("CERT_STRING");
    	if (certString == null || certString.equals("NO CERTS FOUND") || certString.equals("NOT A VALID THERAPIST ID")) {
        	return new ArrayList<>();
    	}
    	return Arrays.asList(certString.split(", "));
	}


	/**
 	* Adds a new certification to the system.
 	*
 	* @param abbreviation the abbreviation of the certification.
 	* @param description  the description of the certification.
 	* @param therapyType  the therapy type associated with the certification.
 	*/
	public void addSystemCertification(String abbreviation, String description, String therapyType) {
    	String query = "CALL MANAGE_SYSTEM_CERTS(?, ?, ?, 'A')";
    	jdbcTemplate.update(query, abbreviation, description, therapyType);
	}


	/**
 	* Deletes a certification from the system.
 	*
 	* @param abbreviation the abbreviation of the certification to be deleted.
 	*/
	public void deleteSystemCertification(String abbreviation) {
    	String query = "CALL MANAGE_SYSTEM_CERTS(?, NULL, NULL, 'D')";
    	jdbcTemplate.update(query, abbreviation);
	}


	/**
 	* Adds a certification to a therapist.
 	*
 	* @param therapistId   the ID of the therapist.
 	* @param abbreviation  the abbreviation of the certification.
 	*/
	public void addTherapistCertification(int therapistId, String abbreviation) {
    	String query = "CALL MANAGE_THERAPIST_CERTS(?, ?, 'A')";
    	jdbcTemplate.update(query, therapistId, abbreviation);
	}


	/**
 	* Deletes a certification from a therapist.
 	*
 	* @param therapistId   the ID of the therapist.
 	* @param abbreviation  the abbreviation of the certification.
 	*/
	public void deleteTherapistCertification(int therapistId, String abbreviation) {
    	String query = "CALL MANAGE_THERAPIST_CERTS(?, ?, 'D')";
    	jdbcTemplate.update(query, therapistId, abbreviation);
	}
}