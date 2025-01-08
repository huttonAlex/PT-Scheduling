package com.ttc.fitPT.ptSchedule.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * HomeController handles the routing for the home and index pages.
 * It listens to root-level requests ("/" and "/index") and returns the index HTML page.
 */
@Controller
public class HomeController {

	/**
 	* Handles GET requests for the index page.
 	* Maps the "/index" URL to the index.html template.
 	*
 	* @return index template, directing Spring to look for index.html in the templates folder
 	*/
	@GetMapping("/index")
	public String indexPage() {
    	return "index";  // Spring will look for index.html in templates
	}

	/**
 	* Handles GET requests for the root URL ("/").
 	* Default route and also returns the index.html template.
 	*
 	* @return index template, directing Spring to look for index.html in the templates folder
 	*/
	@GetMapping("/")
	public String homePage() {
    	return "index";  // Spring will look for index.html in templates
	}
}



