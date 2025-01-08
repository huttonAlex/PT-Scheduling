package com.ttc.fitPT.ptSchedule.controller;


import com.ttc.fitPT.ptSchedule.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import java.util.Map;


/**
 * UserProfileController handles user profile-related operations such as
 * displaying profile information and changing the user's password.
 */
@Controller
@RequestMapping("/api/user")
public class UserProfileController {


	@Autowired
	private UserService userService;


	/**
 	* Displays the user profile page.
 	*
 	* @return the name of the HTML template for the user profile page.
 	*/
	@GetMapping("/profile")
	public String showUserProfilePage(HttpSession session, Model model) {
		String role = (String) session.getAttribute("role");
		model.addAttribute("role", role);
    	return "userProfile"; // Renders the userProfile.html template
	}


	/**
 	* Retrieves the current user's profile information.
 	*
 	* @param session the current HTTP session containing the user's details.
 	* @return a ResponseEntity containing the user information as a JSON object.
 	*/
	@GetMapping("/profile-info")
	@ResponseBody
	public ResponseEntity<Map<String, Object>> getUserProfileInfo(HttpSession session) {
    	Map<String, Object> userInfo = userService.getUserDetails(session);
    	return ResponseEntity.ok(userInfo);
	}


	/**
 	* Updates the user's password or username. Validates the inputs and performs the update.
 	*
 	* @param passwordData a map containing "newUsername" and/or "newPassword".
 	* @param session  	the current HTTP session to identify the user.
 	* @return a ResponseEntity indicating the success or failure of the operation.
 	*/
	@PostMapping("/change-password")
	public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData, HttpSession session) {
    	int personId = (int) session.getAttribute("personId");


    	// Extract new username and password from request
    	String newUsername = passwordData.get("newUsername");
    	String newPassword = passwordData.get("newPassword");


    	// Handle blank inputs
    	if (newUsername != null && newUsername.isBlank()) {
        	newUsername = null;
    	}
    	if (newPassword != null && newPassword.isBlank()) {
        	newPassword = null;
    	}


    	try {
        	boolean success = userService.changeUserPassword(personId, newUsername, newPassword);
        	if (success) {
            	return ResponseEntity.ok(Map.of("success", true));
        	} else {
            	return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    	.body(Map.of("success", false, "message", "Failed to update username or password"));
        	}
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                	.body(Map.of("success", false, "message", e.getMessage()));
    	}
	}
}