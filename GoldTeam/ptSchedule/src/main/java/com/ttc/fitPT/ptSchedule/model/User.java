package com.ttc.fitPT.ptSchedule.model;


import java.util.Arrays;
import java.util.List;


/**
 * Represents a User in the system, including personal details,
 * role information, and associated certifications.
 */
public class User {


	private int personId;
	private int roleId;
	private String firstName;
	private String lastName;
	private String roleType;
	private String email;
	private String phone;
	private String username;
	private String password;
	private List<String> certifications;


	/**
 	* Constructs a new User object with basic details.
 	*
 	* @param personId  the unique identifier for the user.
 	* @param firstName the first name of the user.
 	* @param lastName  the last name of the user.
 	* @param roleType  the role type of the user (e.g., ADMINISTRATOR, THERAPIST).
 	*/
	public User(int personId, String firstName, String lastName, String roleType) {
    	this.personId = personId;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.roleType = roleType;
	}


	/**
 	* Constructs a new User object with full details.
 	*
 	* @param personId   the unique identifier for the user.
 	* @param firstName  the first name of the user.
 	* @param lastName   the last name of the user.
 	* @param roleType   the role type of the user (e.g., ADMINISTRATOR, THERAPIST).
 	* @param roleId 	the unique identifier for the user's role.
 	* @param email  	the user's email address.
 	* @param phone  	the user's phone number.
 	* @param username   the username of the user.
 	* @param password   the password of the user.
 	*/
	public User(int personId, String firstName, String lastName, String roleType, int roleId, String email, String phone, String username, String password) {
    	this.personId = personId;
    	this.firstName = firstName;
    	this.lastName = lastName;
    	this.roleType = roleType;
    	this.email = email;
    	this.phone = phone;
    	this.roleId = roleId;
    	this.username = username;
    	this.password = password;
	}


	/**
 	* Default constructor for creating an empty User object.
 	*/
	public User() {
	}


	/**
 	* Constructs a User object from a comma-separated user information string.
 	*
 	* @param userInfo a string containing user information in the format:
 	*             	"firstName, lastName, personId, roleId, email, phone, username, password, certifications".
 	* @return a User object populated with the parsed data.
 	*/
	public static User fromUserInfo(String userInfo) {
    	String[] fields = userInfo.split(", ");
    	User user = new User();


    	user.setFirstName(fields[0]);
    	user.setLastName(fields[1]);
    	user.setPersonId(Integer.parseInt(fields[2]));
    	user.setRoleId(Integer.parseInt(fields[3]));
    	user.setEmail(fields.length > 4 ? fields[4] : null);
    	user.setPhone(fields.length > 5 ? fields[5] : null);
    	user.setUsername(fields.length > 6 ? fields[6] : null);
    	user.setPassword(fields.length > 7 ? fields[7] : null);


    	if (fields.length > 8 && !fields[8].equalsIgnoreCase("NO CERTS")) {
        	user.setCertifications(Arrays.asList(fields[8].split(", ")));
    	}


    	return user;
	}


	// --- Getters and Setters ---


	public int getPersonId() {
    	return personId;
	}


	public void setPersonId(int personId) {
    	this.personId = personId;
	}


	public int getRoleId() {
    	return roleId;
	}


	public void setRoleId(int roleId) {
    	this.roleId = roleId;
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


	public String getRoleType() {
    	return roleType;
	}


	public void setRoleType(String roleType) {
    	this.roleType = roleType;
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


	public String getUsername() {
    	return username;
	}


	public void setUsername(String username) {
    	this.username = username;
	}


	public String getPassword() {
    	return password;
	}


	public void setPassword(String password) {
    	this.password = password;
	}


	public List<String> getCertifications() {
    	return certifications;
	}


	public void setCertifications(List<String> certifications) {
    	this.certifications = certifications;
	}


	// --- Overrides ---


	/**
 	* Provides a string representation of the User object.
 	*
 	* @return a string containing the user's details.
 	*/
	@Override
	public String toString() {
    	return "User {" +
            	"personId=" + personId +
            	", roleId=" + roleId +
            	", firstName='" + firstName + '\'' +
            	", lastName='" + lastName + '\'' +
            	", roleType='" + roleType + '\'' +
            	", email='" + email + '\'' +
            	", phone='" + phone + '\'' +
            	", username='" + username + '\'' +
            	", certifications=" + certifications +
            	'}';
	}
}






