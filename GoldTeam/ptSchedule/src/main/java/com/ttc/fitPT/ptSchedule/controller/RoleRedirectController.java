package com.ttc.fitPT.ptSchedule.controller;


import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ttc.fitPT.ptSchedule.model.Therapist;

import jakarta.servlet.http.HttpSession;

/**
 * RoleRedirectController handles routing for different user roles after login.
 * Based on the user's role, they will be directed to their specific home page.
 * This controller listens to requests at "/api/roleRedirect".
 */
@Controller
@RequestMapping("/api/roleRedirect")
public class RoleRedirectController {

	/**
 	* Redirects users to the appropriate home page based on their role.
 	* This method checks the user's authentication, retrieves their role, and redirects
 	* them to the appropriate URL.
 	*
 	* @param session the current HTTP session for storing user information
 	* @return the URL for the user's home page based on their role, or redirects
 	*     	to the login page if the role is unrecognized
 	*/
	@GetMapping
	public String redirectBasedOnRole(HttpSession session) {
    	// Get the currently authenticated user's role
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    	String role = auth.getAuthorities().iterator().next().getAuthority();
   	 
    	if (role != null) {
        	switch (role) {
            	case "SCHEDULER":
                	return "redirect:/api/roleRedirect/scheduler";
            	case "ADMINISTRATOR":
                	return "redirect:/api/roleRedirect/administrator";
            	case "THERAPIST":
                	return "redirect:/api/roleRedirect/therapist";
            	default:
                	return "redirect:/unauthorized";
        	}
    	}
    	return "redirect:/login";
	}

	/**
 	* Handles GET requests for the Administrator role.
 	* Redirects users with the "Administrator" role to their home page.
 	*
 	* @param session the current HTTP session for accessing user attributes
 	* @param model   the model for adding attributes to the view
 	* @return the "administratorHome" template, directing Spring to look for administratorHome.html in the templates folder
 	*/
	@GetMapping("/administrator")
	public String administratorHome(HttpSession session, Model model) {
    	String fullName = (String) session.getAttribute("fullName");
    	model.addAttribute("fullName", fullName);
    	return "administratorHome"; // Corresponds to administratorHome.html
	}

	/**
 	* Handles GET requests for the Scheduler role.
 	* Redirects users with the "Scheduler" role to their home page.
 	*
 	* @param session the current HTTP session for accessing user attributes
 	* @param model   the model for adding attributes to the view
 	* @return the "schedulerHome" template, directing Spring to look for schedulerHome.html in the templates folder
 	*/
	@GetMapping("/scheduler")
	public String schedulerHome(HttpSession session, Model model) {
    	String fullName = (String) session.getAttribute("fullName");
    	model.addAttribute("fullName", fullName);
    	return "schedulerHome"; // Corresponds to schedulerHome.html
	}

	/**
 	* Handles GET requests for the Therapist role.
 	* Redirects users with the "Therapist" role to their home page.
 	*
 	* @param session the current HTTP session for accessing user attributes
 	* @param model   the model for adding attributes to the view
 	* @return the "therapistHome" template, directing Spring to look for therapistHome.html in the templates folder
 	*/
	@GetMapping("/therapist")
	public String therapistHome(HttpSession session, Model model) {
    	String fullName = (String) session.getAttribute("fullName");
    	Therapist therapist = (Therapist) session.getAttribute("therapist");
    	model.addAttribute("fullName", fullName);
    	model.addAttribute("hasNewAppointments", therapist.getHasAppt()); 
    	System.out.println(therapist.getHasAppt());
    	return "therapistHome"; // Corresponds to therapistHome.html
	}
}






