package com.ttc.fitPT;

// Importing necessary Spring Boot classes for application startup
import org.springframework.boot.SpringApplication;  // Convenient way to bootstrap a Spring application
import org.springframework.boot.autoconfigure.SpringBootApplication;  // Annotation enables auto-configuration and component scanning

// Main class for the Spring Boot application
@SpringBootApplication  // This annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan so it auto-configures based on the classpath settings, beans, and other properties
public class PtScheduleApplication {

    // Main method, entry point for the Spring Boot application
	public static void main(String[] args) {

		SpringApplication.run(PtScheduleApplication.class, args);
	}

}
