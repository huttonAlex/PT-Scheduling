package com.ttc.fitPT.ptSchedule.service;


import com.ttc.fitPT.ptSchedule.model.Therapist;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;


/**
 * AuthService handles authentication logic, including user credential verification,
 * session management, and retrieval of user roles and details.
 */
@Service
public class AuthService {


	@Autowired
	private JdbcTemplate jdbcTemplate;


	/**
	 * Authenticates the user by verifying their credentials.
	 *
	 * @param username The username of the user.
	 * @param password The password of the user.
	 * @return The personId of the authenticated user if successful, otherwise null.
	 */
	public Integer authenticateUser(String username, String password) {
		String sql = "SELECT FOUND_PERSON(?, ?)";
		Integer personId = jdbcTemplate.queryForObject(sql, Integer.class, username, password);


		if (personId != null) {
			// Clean up past appointments after successful authentication.
			deletePastAppointments();
		}
		return personId;
	}


	/**
	 * Deletes past appointments from the database.
	 * Calls the REMOVE_PATIENTS() stored procedure to remove outdated appointments.
	 */
	public void deletePastAppointments() {
		String sql = "CALL REMOVE_PATIENTS()";
		jdbcTemplate.execute(sql);
	}


	/**
	 * Sets session attributes for the authenticated user.
	 * Populates the session with user information based on their role and personId.
	 *
	 * @param personId The ID of the authenticated user.
	 * @param session  The current HTTP session.
	 */
	public void setSessionAttributes(Integer personId, HttpSession session) {
		String role = getUserRole(personId);


		if (role == null) {
			throw new IllegalStateException("User role is required to set session attributes.");
		}


		String userInfo = getUserInfo(personId);
		String[] userInfoParts = userInfo.split(", ");


		session.setAttribute("role", role);
		session.setAttribute("firstName", userInfoParts[0]);
		session.setAttribute("lastName", userInfoParts[1]);
		session.setAttribute("fullName", userInfoParts[0] + " " + userInfoParts[1]);
		session.setAttribute("personId", personId);
		session.setAttribute("roleId", userInfoParts[3]);
		session.setAttribute("email", userInfoParts[4]);
		session.setAttribute("phone", userInfoParts[5]);


		switch (role.toUpperCase()) {
		case "SCHEDULER":
			session.setAttribute("roleId", userInfoParts[3]);
			break;
			
		case "ADMINISTRATOR":
			session.setAttribute("roleId", userInfoParts[3]);
			break;

		case "THERAPIST":
			Therapist therapist = getTherapistDetails(personId);
			session.setAttribute("therapist", therapist);
			
			break;


		default:
			throw new IllegalStateException("Unexpected role or incorrect user information format.");
		}
	}


	/**
	 * Retrieves detailed information about a therapist.
	 *
	 * @param personId The ID of the therapist.
	 * @return A Therapist object containing the therapist's details.
	 */
	public Therapist getTherapistDetails(int personId) {
		String userInfo = getUserInfo(personId);
		String[] userInfoParts = userInfo.split(", ");


		boolean hasNewAppointments = Boolean.parseBoolean(userInfoParts[6].trim());


		return new Therapist(
				Integer.parseInt(userInfoParts[2].trim()), // personId
				Integer.parseInt(userInfoParts[3].trim()), // therapistId
				userInfoParts[0].trim(), // firstName
				userInfoParts[1].trim(), // lastName
				userInfoParts[4].trim(), // email
				userInfoParts[5].trim(), // phone
				hasNewAppointments // hasNewAppointments
				);
	}


	/**
	 * Retrieves the role of a user based on their personId.
	 *
	 * @param personId The ID of the user.
	 * @return The role of the user as a String.
	 */
	private String getUserRole(int personId) {
		String sql = "SELECT FOUND_TYPE(?)";
		String result = jdbcTemplate.queryForObject(sql, String.class, personId);


		if (result != null && result.contains(",")) {
			return result.split(",")[0].trim();
		}
		throw new IllegalArgumentException("Unexpected format in role retrieval for personId " + personId);
	}


	/**
	 * Retrieves detailed user information based on their personId.
	 *
	 * @param personId The ID of the user.
	 * @return A String containing user details in a formatted manner.
	 */
	private String getUserInfo(int personId) {
		String sql = "SELECT RETURN_USER_INFO(?)";
		return jdbcTemplate.queryForObject(sql, String.class, personId);
	}
}






