package com.ttc.fitPT.ptSchedule.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import com.ttc.fitPT.ptSchedule.service.AuthService;

import jakarta.servlet.http.HttpSession;


/**
 * SecurityConfig class configures the security settings of the application.
 * It sets up authentication, authorization, and login/logout behavior.
 */
@Configuration
public class SecurityConfig {


	@Autowired
	private AuthService authService;


	/**
 	* Defines the security filter chain, setting up the login page, authentication provider,
 	* and access control based on user roles.
 	*
 	* @param http HttpSecurity object to configure security features
 	* @return SecurityFilterChain defining security behavior for the application
 	* @throws Exception if configuration fails
 	*/
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    	http
        	.authenticationProvider(customAuthenticationProvider())  // Set custom authentication provider
        	.csrf(csrf -> csrf.disable())  // Disable CSRF for simplicity
        	.authorizeHttpRequests(auth -> auth
            	.requestMatchers("/api/auth/login", "/index", "/css/**", "/images/**").permitAll()  // Public access
            	.requestMatchers("/api/roleRedirect/**").hasAnyAuthority("SCHEDULER", "ADMINISTRATOR", "THERAPIST")  // Role-based access
            	.requestMatchers("/api/scheduler/**").hasAuthority("SCHEDULER")
            	.anyRequest().authenticated()  // All other requests require authentication
        	)
        	.formLogin(login -> login
            	.loginPage("/api/auth/login")  // Custom login
            	.loginProcessingUrl("/api/auth/login")  // Login form submission URL
            	.defaultSuccessUrl("/api/roleRedirect")  // Redirect after successful login
            	.failureUrl("/api/auth/login?error=true")  // Redirect to login page on failure
            	.permitAll()
        	)
        	.logout(logout -> logout
            	.logoutUrl("/logout")
            	.logoutSuccessUrl("/index")  // Redirect to index after logout
            	.permitAll()
        	);


    	System.out.println("Security Filter Chain is configured");
    	return http.build();
	}


	/**
 	* Provides the authentication manager used in the application.
 	*
 	* @param http HttpSecurity object
 	* @return AuthenticationManager configured with the custom authentication provider
 	* @throws Exception if the configuration fails
 	*/
	@Bean
	public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    	return http.getSharedObject(AuthenticationManagerBuilder.class)
        	.authenticationProvider(customAuthenticationProvider())
        	.build();
	}


	/**
 	* Custom authentication provider that uses AuthService to validate users
 	* and assign appropriate roles.
 	*
 	* @return AuthenticationProvider
 	*/
	@Bean
	public AuthenticationProvider customAuthenticationProvider() {
    	return new AuthenticationProvider() {


        	@Override
        	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
            	String username = authentication.getName();
            	String password = authentication.getCredentials().toString();
            	
            	System.out.println("Username and password: " + username + " " + password);

            	Integer personId = authService.authenticateUser(username, password);
            	
            	if (personId != null) {
            		/*
            		// Split the result to get role and full name
            		String[] parts = result.split(", ");
            		String role = parts[0];
            		String fullName = parts.length > 1 ? parts[1] : "";
            		*/
            		
            		HttpSession session = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest().getSession();
            		authService.setSessionAttributes(personId, session);
            		
            		String role = (String) session.getAttribute("role");
            		//session.setAttribute("fullName", fullName);
            		if (role == null || role.isEmpty() ) {
            			throw new IllegalArgumentException("Role is required for authentication");
            		}
            		
                	// Assign the appropriate role as authority
                	List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.toUpperCase()));
                	
                	return new UsernamePasswordAuthenticationToken(username, password, authorities);
            	} else {
                	throw new AuthenticationException("Invalid Credentials") {
                    	private static final long serialVersionUID = 1L;
                	};
            	}
        	}
        	@Override
        	public boolean supports(Class<?> authentication) {
            	return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
        	}
    	};
	}
}





