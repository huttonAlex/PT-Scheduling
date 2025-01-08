package com.ttc.fitPT.ptSchedule.service;




import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import com.ttc.fitPT.ptSchedule.model.Therapist;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;




@Service
public class TherapistService {


	private static final Logger logger = LoggerFactory.getLogger(TherapistService.class);


	@Autowired
	private JdbcTemplate jdbcTemplate;





	/**
	 * Saves the therapist's availability schedule to the database.
	 *
	 * @param therapistId the ID of the therapist
	 * @param date    	the date of availability
	 * @param startTime   the start time of availability
	 * @param endTime 	the end time of availability
	 */
	public void addTherapistAvailability(int therapistId, LocalDate date, LocalTime startTime, LocalTime endTime) {
		// Change to MODIFY_SCHEDULE
		String sql = "CALL MODIFY_SCHEDULE(?, ?, ?, ?)";
		System.out.println("addTherapistAvailablity: " + " id: " + therapistId + " date: " + date + " start: " + startTime + " end: " + endTime);
		jdbcTemplate.update(sql, therapistId, date, startTime, endTime);
	}




	/**
	 * Retrieves the schedule for the therapist.
	 *
	 * @param therapistId the ID of the therapist
	 * @return a list of schedule entries for the therapist
	 */
	public List<Map<String, Object>> getScheduleByTherapist(int therapistId) {
		String sql = "SELECT date, start_time, end_time FROM therapist_schedule WHERE therapist_id = ?";
		return jdbcTemplate.queryForList(sql, therapistId);
	}




	// RowMapper for extracting a single string result from a function
	private static final RowMapper<String> singleStringMapper = (rs, rowNum) -> rs.getString(1);




	// Fetches schedule IDs within the next 30 days for a given therapist ID
	public List<Integer> getScheduleIdsWithin30Days(int therapistId) {
		System.out.println("ran getScheduleID method");
		String sql = "SELECT RETURN_SCHEDULE_IDS(?)";


		// Query for a single result as String and map to List<Integer>
		return jdbcTemplate.query(sql, singleStringMapper, therapistId)
				.stream()
				.flatMap(result -> {
					if ("NO IDS FOUND".equals(result)) {
						return List.<Integer>of().stream();
					}
					System.out.println(therapistId + "therapist id");
					logger.info("ScheduleId's retrieved in service therapist id{}: {}", therapistId, result);
					return Arrays.stream(result.split(","))
							.map(String::trim)
							.map(Integer::parseInt);
				})
				.collect(Collectors.toList());
	}




	public Map<String, String> getScheduleInformation(int scheduleId) {
		String sql = "SELECT RETURN_SCHEDULE_INFORMATION(NULL, NULL, NULL, ?)";
		return jdbcTemplate.query(sql, singleStringMapper, scheduleId)
				.stream()
				.findFirst()
				.map(result -> {
					if ("NOT A VALID SCHEDULE ID".equals(result)) {
						return null;
					}
					String[] scheduleParts = result.split(", ");
					return Map.of(
							"date", scheduleParts[1],
							"startTime", scheduleParts[2],
							"endTime", scheduleParts[3]
							);
				})
				.orElse(null);
	}


	public void addDefaultSchedule(int therapistId, String dayOfWeek, String startTime, String endTime) {
		String sql = "CALL UPDATE_DEFAULT_SCHED(?, ?, ?, ?)";
		jdbcTemplate.update(sql, therapistId, dayOfWeek, startTime, endTime);
	}


	public List<Map<String, String>> getDefaultSchedule(int therapistId) {
		String sql = "SELECT RETURN_DEFAULT_SCHEDULE(?)";
		return jdbcTemplate.query(sql, singleStringMapper, therapistId)
				.stream()
				.flatMap(result -> {
					if ("NO DEFAULT SCHEDULE FOUND".equals(result)) {
						return List.<Map<String, String>>of().stream();
					}
					return Arrays.stream(result.split(";"))
							.map(String::trim)
							.map(entry -> {
								String[] parts = entry.split(", ");
								return Map.of(
										"dayOfWeek", parts[0],
										"startTime", parts[1],
										"endTime", parts[2]
										);
							});
				})
				.collect(Collectors.toList());
	}


	public void modifyAvailability(int therapistId, LocalDate date, LocalTime startTime, LocalTime endTime) {
		String sql = "CALL MODIFY_SCHEDULE(?, ?, NULL, ?, ?)";
		System.out.println(therapistId + "" + date + startTime + endTime);
		jdbcTemplate.update(sql, therapistId, date.toString(), startTime.toString(), endTime.toString());
	}


	public List<Map<String, String>> getModifiedAvailability(int therapistId, LocalDate startDate, LocalDate endDate) {
		String sql = "SELECT RETURN_SCHEDULE_INFORMATION(?, ?, ?, NULL)";
		return jdbcTemplate.query(sql, singleStringMapper, therapistId, startDate.toString(), endDate.toString())
				.stream()
				.flatMap(result -> {
					if ("NO AVAILABILITY FOUND".equals(result)) {
						return List.<Map<String, String>>of().stream();
					}
					return Arrays.stream(result.split(";"))
							.map(String::trim)
							.map(entry -> {
								String[] parts = entry.split(", ");
								return Map.of(
										"scheduleId", parts[0],
										"therapistId", parts[1],
										"date", parts[2],
										"startTime", parts[3],
										"endTime", parts[4]
										);
							});
				})
				.collect(Collectors.toList());
	}


	/*public List<Map<String, String>> getAppointmentsForMonth(int therapistId, LocalDate startDate, LocalDate endDate) {
    	String sql = "SELECT RETURN_APPT_IDS(?, ?, ?)";
    	return jdbcTemplate.query(sql, singleStringMapper, therapistId, startDate.toString(), endDate.toString())
        	.stream()
        	.flatMap(result -> {
            	if ("NO IDS FOUND".equals(result)) {
                	return List.<Map<String, String>>of().stream();
            	}
            	String[] apptIds = result.split(", ");
            	System.out.println("apptIds: " + apptIds);
            	return Arrays.stream(apptIds)
                	.map(String::trim)
                	.map(apptId -> {
                    	String apptInfoSql = "SELECT RETURN_APPT_INFORMATION(?)";
                    	String apptInfo = jdbcTemplate.queryForObject(apptInfoSql, String.class, Integer.parseInt(apptId));
                    	System.out.println("apptInfo" + apptInfo);
                    	String[] apptParts = apptInfo.split(", ");
                    	return Map.of(
                        	"patientId", apptParts[0],
                        	"therapistId", apptParts[1],
                        	"date", apptParts[2],
                        	"startTime", apptParts[3],
                        	"endTime", apptParts[4],
                        	"therapyType", apptParts[5],
                        	"notes", apptParts[6]
                    	);
                	});
        	})
        	.collect(Collectors.toList());
	}
	 */
	public List<Map<String, String>> getAppointmentsForMonth(int therapistId, LocalDate startDate, LocalDate endDate) {
		String sql = "SELECT RETURN_APPT_IDS(?, ?, ?)";
		String result = jdbcTemplate.queryForObject(sql, String.class, therapistId, startDate.toString(), endDate.toString());

		if ("NO IDS FOUND".equals(result)) {
			return Collections.emptyList();
		}
		String[] apptIds = result.split(", ");
		List<Map<String, String>> appointments = new ArrayList<>();
		for (String apptIdStr : apptIds) {
			String apptIdTrimmed = apptIdStr.trim();
			if (apptIdTrimmed.isEmpty()) {
				continue;
			}

			int apptId;
			try {
				apptId = Integer.parseInt(apptIdTrimmed);
			} catch (NumberFormatException e) {
				System.err.println("Invalid appointment ID: " + apptIdTrimmed);
				continue;
			}

			String apptInfoSql = "SELECT RETURN_PATIENT_APPTS(NULL, NULL, NULL, NULL, ?)";
			String apptInfo = jdbcTemplate.queryForObject(apptInfoSql, String.class, apptId);
			if (apptInfo == null || apptInfo.isEmpty() ||
					apptInfo.startsWith("NOT") || apptInfo.startsWith("NO")) {
				continue;
			}

			String[] apptInfoArray = apptInfo.split(";");
			for (String singleApptInfo : apptInfoArray) {
				String singleApptTrimmed = singleApptInfo.trim();
				if (singleApptTrimmed.isEmpty()) {
					continue;
				}
				String[] apptParts = singleApptTrimmed.split(", ");
				if (apptParts.length < 12) {
					System.err.println("Invalid appointment data: " + singleApptTrimmed);
					continue;
				}

				Map<String, String> appointment = new HashMap<>();
				appointment.put("patientFirstName", apptParts[0]);
				appointment.put("patientLastName", apptParts[1]);
				appointment.put("patientEmail", apptParts[2]);
				appointment.put("patientPhone", apptParts[3]);
				appointment.put("therapistId", apptParts[4]);
				appointment.put("therapistFullName", apptParts[5]);
				appointment.put("therapyType", apptParts[6]);
				appointment.put("apptId", apptParts[7]);
				appointment.put("date", apptParts[8]);
				appointment.put("startTime", apptParts[9]);
				appointment.put("endTime", apptParts[10]);
				appointment.put("notes", apptParts[11]);

				appointments.add(appointment);
			}
		}
		return appointments;
	}

	public void updateTherapistAppointments(int therapistId) {
		String sql = "CALL UPDATE_THERAPIST_APPTS(?)";
		jdbcTemplate.update(sql, therapistId);
	}

	public List<Integer> getConflictingAppointments(int therapistId, LocalDate date, LocalTime startTime, LocalTime endTime) {
		String sql = "SELECT RETURN_CONFLICTING_APPTS(?, ?, ?, ?)";
		String result = jdbcTemplate.queryForObject(sql, String.class, therapistId, date.toString(), startTime.toString(), endTime.toString());

		if("NO IDS FOUND".equals(result)) {
			return Collections.emptyList();
		}

		String [] idsArray = result.split(",\\s*");
		List<Integer> appointmentIds = new ArrayList<>();
		for (String idStr : idsArray) {
			try {
				appointmentIds.add(Integer.parseInt(idStr));
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}
		return appointmentIds;
	}

	public boolean submitLeaveRequest(int therapistId, LocalDate date, LocalTime currentStartTime, LocalTime currentEndTime, LocalTime newStartTime, LocalTime newEndTime) {
		// First, check for conflicting appointments
		List<Integer> conflictingAppts = getConflictingAppointments(therapistId, date, newStartTime, newEndTime);
		if (!conflictingAppts.isEmpty()) {
			// There are conflicting appointments
			return false;
		}


		String sql = "CALL MODIFY_SCHEDULE(?, ?, ?, ?, ?, ?, ?)";
		jdbcTemplate.update(sql,
				therapistId,
				date.toString(),
				currentStartTime != null ? currentStartTime.toString() : null,
						currentEndTime != null ? currentEndTime.toString() : null,
								null, // new_day is null
								newStartTime != null ? newStartTime.toString() : null,
										newEndTime != null ? newEndTime.toString() : null
				);
		return true;
	}


	// Update cancelLeaveRequest method
	public void cancelLeaveRequest(int therapistId, LocalDate date, LocalTime currentStartTime, LocalTime currentEndTime) {
		String sql = "CALL MODIFY_SCHEDULE(?, ?, ?, ?, NULL, '00:00:00', '00:00:00')";
		jdbcTemplate.update(sql,
				therapistId,
				date.toString(),
				currentStartTime.toString(),
				currentEndTime.toString()
				);
	}

	public List<Therapist> getTherapists() {
		// Step 1: Fetch all therapists
		String userTableQuery = "SELECT RETURN_USER_TABLE(NULL, NULL, 'THERAPIST')";
		String userTableData = jdbcTemplate.queryForObject(userTableQuery, String.class);


		// Parse user table data
		Map<Integer, Therapist> therapistMap = Arrays.stream(userTableData.split("; "))
	        	.map(entry -> entry.split(", "))
	        	.collect(Collectors.toMap(
	                	parts -> Integer.parseInt(parts[0]), // Person ID
	                	parts -> new Therapist(parts[1].trim(), parts[2].trim()) // First Name, Last Name
	        	));


		// Fetch Therapist IDs using RETURN_USER_INFO
		therapistMap.forEach((personId, therapist) -> {
	    	String userInfoQuery = String.format("SELECT RETURN_USER_INFO(%d)", personId);
	    	String userInfoData = jdbcTemplate.queryForObject(userInfoQuery, String.class);


	    	// Parse user info data
	    	String[] userInfoParts = userInfoData.split(", ");
	    	therapist.setTherapistId(Integer.parseInt(userInfoParts[3].trim())); // Therapist ID
		});


		// Fetch Ratings
		String ratingsQuery = "SELECT GET_THERAPIST_RATINGS()";
		String ratingsData = jdbcTemplate.queryForObject(ratingsQuery, String.class);


		// Parse ratings data
		Arrays.stream(ratingsData.split("; ")).forEach(entry -> {
	    	String[] parts = entry.split(", ");
	    	int therapistId = Integer.parseInt(parts[0]);
	    	int rating = Integer.parseInt(parts[1]);
	    	int numRatings = Integer.parseInt(parts[2]);


	    	therapistMap.values().stream()
	            	.filter(therapist -> therapist.getTherapistId() == therapistId)
	            	.findFirst()
	            	.ifPresent(therapist -> {
	                	therapist.setRating(rating);
	                	therapist.setNumRatings(numRatings);
	            	});
		});


		return new ArrayList<>(therapistMap.values());
	}




	public void addTherapistReview(int therapistId, int rating) {
		String sqlCall = String.format("CALL ADD_THERAPIST_REVIEW(%d, %d)", therapistId, rating);
		jdbcTemplate.execute(sqlCall);
		
	}

}





