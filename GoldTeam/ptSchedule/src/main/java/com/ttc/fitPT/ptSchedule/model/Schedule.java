package com.ttc.fitPT.ptSchedule.model;


import java.time.LocalDate;
import java.time.LocalTime;


/**
 * Represents a schedule entry for a therapist, including the date,
 * start time, and end time of availability.
 */
public class Schedule {


	private int scheduleId;
	private int therapistId;
	private LocalDate scheduleDay;
	private LocalTime startTime;
	private LocalTime endTime;


	/**
 	* Constructs a new Schedule object.
 	*
 	* @param scheduleId  the unique identifier for the schedule.
 	* @param therapistId the ID of the therapist associated with the schedule.
 	* @param scheduleDay the date of the schedule.
 	* @param startTime   the start time of the schedule.
 	* @param endTime 	the end time of the schedule.
 	*/
	public Schedule(int scheduleId, int therapistId, LocalDate scheduleDay, LocalTime startTime, LocalTime endTime) {
    	this.scheduleId = scheduleId;
    	this.therapistId = therapistId;
    	this.scheduleDay = scheduleDay;
    	this.startTime = startTime;
    	this.endTime = endTime;
	}


	// --- Getters and Setters ---


	/**
 	* Gets the unique identifier for the schedule.
 	*
 	* @return the schedule ID.
 	*/
	public int getScheduleId() {
    	return scheduleId;
	}


	/**
 	* Sets the unique identifier for the schedule.
 	*
 	* @param scheduleId the schedule ID to set.
 	*/
	public void setScheduleId(int scheduleId) {
    	this.scheduleId = scheduleId;
	}


	/**
 	* Gets the ID of the therapist associated with the schedule.
 	*
 	* @return the therapist ID.
 	*/
	public int getTherapistId() {
    	return therapistId;
	}


	/**
 	* Sets the ID of the therapist associated with the schedule.
 	*
 	* @param therapistId the therapist ID to set.
 	*/
	public void setTherapistId(int therapistId) {
    	this.therapistId = therapistId;
	}


	/**
 	* Gets the date of the schedule.
 	*
 	* @return the schedule day.
 	*/
	public LocalDate getScheduleDay() {
    	return scheduleDay;
	}


	/**
 	* Sets the date of the schedule.
 	*
 	* @param scheduleDay the schedule day to set.
 	*/
	public void setScheduleDay(LocalDate scheduleDay) {
    	this.scheduleDay = scheduleDay;
	}


	/**
 	* Gets the start time of the schedule.
 	*
 	* @return the start time.
 	*/
	public LocalTime getStartTime() {
    	return startTime;
	}


	/**
 	* Sets the start time of the schedule.
 	*
 	* @param startTime the start time to set.
 	*/
	public void setStartTime(LocalTime startTime) {
    	this.startTime = startTime;
	}


	/**
 	* Gets the end time of the schedule.
 	*
 	* @return the end time.
 	*/
	public LocalTime getEndTime() {
    	return endTime;
	}


	/**
 	* Sets the end time of the schedule.
 	*
 	* @param endTime the end time to set.
 	*/
	public void setEndTime(LocalTime endTime) {
    	this.endTime = endTime;
	}


	// --- Overrides ---


	/**
 	* Provides a string representation of the Schedule object.
 	*
 	* @return a string containing the schedule details.
 	*/
	@Override
	public String toString() {
    	return "Schedule {" +
            	"scheduleId=" + scheduleId +
            	", therapistId=" + therapistId +
            	", scheduleDay=" + scheduleDay +
            	", startTime=" + startTime +
            	", endTime=" + endTime +
            	'}';
	}
}






