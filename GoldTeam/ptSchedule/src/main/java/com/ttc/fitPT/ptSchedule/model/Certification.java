package com.ttc.fitPT.ptSchedule.model;


/**
 * Represents a Certification associated with a therapist or therapy type.
 */
public class Certification {


	private String abbreviation;
	private String description;
	private String therapyType;


	/**
 	* Constructs a new Certification object.
 	*
 	* @param abbreviation the abbreviated name of the certification.
 	* @param description  a brief description of the certification.
 	* @param therapyType  the type of therapy associated with the certification.
 	*/
	public Certification(String abbreviation, String description, String therapyType) {
    	this.abbreviation = abbreviation;
    	this.description = description;
    	this.therapyType = therapyType;
	}


	// --- Getters ---


	/**
 	* Gets the abbreviation of the certification.
 	*
 	* @return the abbreviation.
 	*/
	public String getAbbreviation() {
    	return abbreviation;
	}


	/**
 	* Gets the description of the certification.
 	*
 	* @return the description.
 	*/
	public String getDescription() {
    	return description;
	}


	/**
 	* Gets the therapy type associated with the certification.
 	*
 	* @return the therapy type.
 	*/
	public String getTherapyType() {
    	return therapyType;
	}


	// --- Setters ---


	/**
 	* Sets the abbreviation of the certification.
 	*
 	* @param abbreviation the abbreviation to set.
 	*/
	public void setAbbreviation(String abbreviation) {
    	this.abbreviation = abbreviation;
	}


	/**
 	* Sets the description of the certification.
 	*
 	* @param description the description to set.
 	*/
	public void setDescription(String description) {
    	this.description = description;
	}


	/**
 	* Sets the therapy type associated with the certification.
 	*
 	* @param therapyType the therapy type to set.
 	*/
	public void setTherapyType(String therapyType) {
    	this.therapyType = therapyType;
	}


	// --- Overrides ---


	/**
 	* Provides a string representation of the Certification object.
 	*
 	* @return a string containing the certification's details.
 	*/
	@Override
	public String toString() {
    	return "Certification {" +
            	"abbreviation='" + abbreviation + '\'' +
            	", description='" + description + '\'' +
            	", therapyType='" + therapyType + '\'' +
            	'}';
	}
}






