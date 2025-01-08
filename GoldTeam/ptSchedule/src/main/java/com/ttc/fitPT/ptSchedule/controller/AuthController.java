package com.ttc.fitPT.ptSchedule.controller;


import com.ttc.fitPT.ptSchedule.service.AuthService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


/**
 * AuthController manages user authentication, including login, logout, and role redirection.
 */
@Controller
@RequestMapping("/api/auth")
public class AuthController {


	@Autowired
	private AuthService authService;


	/**
 	* Handles POST requests for user login.
 	*
 	* @param loginData a map containing "username" and "password" fields.
 	* @param session   the HTTP session for storing user-specific attributes.
 	* @return a ResponseEntity containing the redirect URL for role-based navigation or an error message.
 	*/
	@PostMapping("/login")
	public ResponseEntity<String> handleLogin(@RequestBody Map<String, String> loginData, HttpSession session) {
    	try {
        	String username = loginData.get("username");
        	String password = loginData.get("password");


        	Integer personId = authService.authenticateUser(username, password);


        	if (personId != null) {
            	// Set session attributes for the authenticated user
            	authService.setSessionAttributes(personId, session);
            	return ResponseEntity.ok("/api/roleRedirect");
        	} else {
            	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        	}
    	} catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Login failed: " + e.getMessage());
    	}
	}


	/**
 	* Serves the login page.
 	*
 	* @param model a model object for passing attributes to the view.
 	* @return the name of the login page view.
 	*/
	@GetMapping("/login")
	public String loginPage(Model model) {
    	return "login";
	}


	/**
 	* Serves the welcome page.
 	*
 	* @return the name of the welcome page view.
 	*/
	@GetMapping("/welcome")
	public String welcomePage() {
    	return "welcome";
	}


	/**
 	* Logs out the current user by invalidating their session and redirects to the index page.
 	*
 	* @param session the HTTP session to be invalidated.
 	* @return a redirect string to the index page.
 	*/
	@GetMapping("/logout")
	public String logout(HttpSession session) {
    	session.invalidate();
    	return "redirect:/index";
	}
}






