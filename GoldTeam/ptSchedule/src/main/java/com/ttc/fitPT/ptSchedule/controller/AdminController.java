package com.ttc.fitPT.ptSchedule.controller;

import com.ttc.fitPT.ptSchedule.model.Certification;
import com.ttc.fitPT.ptSchedule.model.User;
import com.ttc.fitPT.ptSchedule.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * AdminController provides endpoints for managing users, therapists, and certifications.
 */
@Controller
@RequestMapping("/api/admin")
public class AdminController {


	@Autowired
	private AdminService adminService;


	/**
	 * Displays the admin dashboard page.
	 *
	 * @return the name of the admin dashboard view.
	 */
	@GetMapping("/dashboard")
	public String adminDashboard() {
		return "adminDashboard";
	}


	/**
	 * Retrieves a list of users with optional sorting and filtering.
	 *
	 * @param sortBy 	the field to sort by (optional).
	 * @param sortOrder  the sorting order (asc/desc, optional).
	 * @param personType the type of person to filter by (optional).
	 * @return a list of users.
	 */
	@GetMapping("/users")
	@ResponseBody
	public List<User> getUserInfo(
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestParam(value = "sortOrder", required = false) String sortOrder,
			@RequestParam(value = "personType", required = false) String personType) {
		return adminService.getAllUsers(sortBy, sortOrder, personType);
	}


	/**
	 * Retrieves detailed therapist information by their ID.
	 *
	 * @param id the therapist's ID.
	 * @return a map containing therapist details and certifications.
	 * @throws Exception if the therapist info retrieval fails.
	 */
	@GetMapping("/therapist/{id}")
	@ResponseBody
	public Map<String, Object> getTherapistInfo(@PathVariable int id) throws Exception {
		String info = adminService.getTherapistInfo(id);
		String[] details = info.split(", ");
		Map<String, Object> therapistData = new HashMap<>();
		therapistData.put("firstName", details[0]);
		therapistData.put("lastName", details[1]);
		therapistData.put("personId", Integer.parseInt(details[2]));
		therapistData.put("therapistId", Integer.parseInt(details[3]));
		therapistData.put("email", details[4]);
		therapistData.put("phone", details[5]);
		therapistData.put("certifications", adminService.getTherapistCertifications(id));
		return therapistData;
	}


	/**
	 * Retrieves certification details by its abbreviation.
	 *
	 * @param abbr the certification abbreviation.
	 * @return a map containing certification details.
	 */
	@GetMapping("/certification/{abbr}")
	@ResponseBody
	public Map<String, String> getCertificationInfo(@PathVariable String abbr) {
		String certInfo = adminService.getCertificationInfo(abbr);
		String[] details = certInfo.split(", ");
		Map<String, String> certData = new HashMap<>();
		certData.put("abbreviation", details[0]);
		certData.put("description", details[1]);
		certData.put("therapyType", details[2]);
		return certData;
	}


	/**
	 * Deletes a user by their ID.
	 *
	 * @param id the user's ID.
	 * @return a response entity indicating the result of the operation.
	 */
	@DeleteMapping("/user/{id}")
	@ResponseBody
	public ResponseEntity<?> deleteUser(@PathVariable int id) {
		try {
			adminService.deleteUser(id);
			return ResponseEntity.ok("User deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete user");
		}
	}


	/**
	 * Updates user information by their ID.
	 *
	 * @param id  	the user's ID.
	 * @param updates a map containing the updated user fields.
	 * @return a response entity with a success message.
	 */
	@PutMapping("/user/{id}")
	@ResponseBody
	public ResponseEntity<Map<String, String>> editUser(
			@PathVariable int id,
			@RequestBody Map<String, String> updates) {


		adminService.editUser(
				id,
				updates.getOrDefault("firstName", null),
				updates.getOrDefault("lastName", null),
				updates.getOrDefault("uName", null),
				updates.getOrDefault("pWord", null),
				updates.getOrDefault("email", null),
				updates.getOrDefault("phone", null)
				);


		Map<String, String> response = new HashMap<>();
		response.put("status", "success");
		response.put("message", "User updated successfully");
		return ResponseEntity.ok(response);
	}


	/**
	 * Adds a new user to the system.
	 *
	 * @param newUser a map containing user details.
	 * @return a response entity indicating the result of the operation.
	 */
	@PostMapping("/user")
	@ResponseBody
	public ResponseEntity<?> addUser(@RequestBody Map<String, Object> newUser) {
		try {
			adminService.addUser(
					(String) newUser.get("firstName"),
					(String) newUser.get("lastName"),
					(String) newUser.get("personType"),
					(String) newUser.get("email"),
					(String) newUser.get("phone")
					);
			return ResponseEntity.ok("User added successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add user");
		}
	}


	/**
	 * Retrieves all certifications in the system.
	 *
	 * @return a list of certifications.
	 */
	@GetMapping("/certifications")
	@ResponseBody
	public List<Certification> getAllCertifications() {
		return adminService.getAllCertifications();
	}


	/**
	 * Retrieves certifications for a specific therapist by their ID.
	 *
	 * @param id the therapist's ID.
	 * @return a list of certifications for the therapist.
	 */
	@GetMapping("/therapist/{id}/certifications")
	@ResponseBody
	public List<String> getTherapistCertifications(@PathVariable int id) {
		try {
			return adminService.getTherapistCertifications(id);
		} catch (Exception e) {
			e.printStackTrace();
			return new ArrayList<>();
		}
	}


	/**
	 * Adds a new certification to the system.
	 *
	 * @param certData a map containing certification details.
	 * @return a response entity indicating the result of the operation.
	 */
	@PostMapping("/certification")
	@ResponseBody
	public ResponseEntity<?> addSystemCertification(@RequestBody Map<String, String> certData) {
		try {
			adminService.addSystemCertification(
					certData.get("abbreviation"),
					certData.get("description"),
					certData.get("therapyType")
					);
			return ResponseEntity.ok("Certification added successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add certification");
		}
	}


	/**
	 * Deletes a certification from the system by its abbreviation.
	 *
	 * @param abbreviation the certification abbreviation.
	 * @return a response entity indicating the result of the operation.
	 */
	@DeleteMapping("/certification/{abbreviation}")
	@ResponseBody
	public ResponseEntity<?> deleteSystemCertification(@PathVariable String abbreviation) {
		try {
			adminService.deleteSystemCertification(abbreviation);
			return ResponseEntity.ok("Certification deleted successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete certification");
		}
	}


	/**
	 * Assigns a certification to a therapist.
	 *
	 * @param id   	the therapist's ID.
	 * @param certData a map containing the certification abbreviation.
	 * @return a response entity indicating the result of the operation.
	 */
	@PostMapping("/therapist/{id}/certification")
	@ResponseBody
	public ResponseEntity<?> addTherapistCertification(
			@PathVariable int id,
			@RequestBody Map<String, String> certData) {
		try {
			adminService.addTherapistCertification(id, certData.get("abbreviation"));
			return ResponseEntity.ok("Certification added to therapist successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add certification to therapist");
		}
	}


	/**
	 * Removes a certification from a therapist.
	 *
	 * @param id       	the therapist's ID.
	 * @param abbreviation the certification abbreviation.
	 * @return a response entity indicating the result of the operation.
	 */
	@DeleteMapping("/therapist/{id}/certification/{abbreviation}")
	@ResponseBody
	public ResponseEntity<?> deleteTherapistCertification(
			@PathVariable int id,
			@PathVariable String abbreviation) {
		try {
			adminService.deleteTherapistCertification(id, abbreviation);
			return ResponseEntity.ok("Certification removed from therapist successfully");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to remove certification from therapist");
		}
	}
	
	@GetMapping("/therapist-ratings")
	@ResponseBody
	public String getTherapistRatings() {
		System.out.println("Sending ratings to front end");
		return adminService.getTherapistRatings();
	}
}






