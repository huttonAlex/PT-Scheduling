-- BE SURE TO CREATE THERAPIST AND PATIENT 0 AND GIVE THERAPIST 0 NO (DEFAULT) SCHEDULE!!!!
-- ACCOUNT FOR THERAPIST PATIENT_APPTS WITH PATIENT 0 AND DO NOT RETURN THEM!

-- ------------------------------------------------------
-- -- PERSON TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS PERSON;

-- -- CREATING THE TABLE -- --
CREATE TABLE PERSON
(
    PERSON_ID INT NOT NULL AUTO_INCREMENT,
    FIRST_NAME VARCHAR(30) NOT NULL,
    LAST_NAME VARCHAR(30) NOT NULL,
    PERSON_TYPE VARCHAR(15) NOT NULL,
    PRIMARY KEY (PERSON_ID)
)
;

-- -- TEST VALUES -- --
INSERT INTO PERSON VALUES
(1, "JOHN", "DOE", "SCHEDULER")
(2, "JANETTE", "DOE", "ADMINISTRATOR")
(3, "JOEY", "DOE", "PATIENT")
(4, "JANEY", "DOE", "THERAPIST")
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM PERSON;
ALTER TABLE PERSON AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- PERSON TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- SCHEDULER TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS SCHEDULER;

-- -- CREATING THE TABLE -- --
CREATE TABLE SCHEDULER
(
    SCHEDULER_ID INT NOT NULL AUTO_INCREMENT,
    PERSON_ID INT NOT NULL,
    SCHEDULER_EMAIL VARCHAR(100),
    SCHEDULER_PHONE VARCHAR(20),
    PRIMARY KEY (SCHEDULER_ID),
    FOREIGN KEY (PERSON_ID) REFERENCES PERSON(PERSON_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES - TWO VERSIONS -- --
INSERT INTO SCHEDULER VALUES
(1, 1, NULL, NULL)
;

-- PREFERRED AS THERE IS ONLY ONE SCHEDULER AT A TIME (?)
INSERT INTO SCHEDULER
SELECT S.SCHEDULER_ID, P.PERSON_ID
FROM
    (SELECT AUTO_INCREMENT AS SCHEDULER_ID
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = "FITNESS_DB_TEST"
        AND TABLE_NAME = "SCHEDULER") S,
    (SELECT PERSON_ID FROM PERSON WHERE PERSON_TYPE = "Scheduler") P
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM SCHEDULER;
ALTER TABLE SCHEDULER AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- SCHEDULER TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- ADMINISTRATOR TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS ADMINISTRATOR;

-- -- CREATING THE TABLE -- --
CREATE TABLE ADMINISTRATOR
(
    ADMIN_ID INT NOT NULL AUTO_INCREMENT,
    PERSON_ID INT NOT NULL,
    ADMIN_EMAIL VARCHAR(100),
    ADMIN_PHONE VARCHAR(20),
    PRIMARY KEY (ADMIN_ID),
    FOREIGN KEY (PERSON_ID) REFERENCES PERSON(PERSON_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES - TWO VERSIONS -- --
INSERT INTO ADMINISTRATOR VALUES
(1, 2, NULL, NULL)
;

-- only if one person at a time
INSERT INTO ADMINISTRATOR
SELECT A.ADMIN_ID, P.PERSON_ID
FROM
    (SELECT AUTO_INCREMENT AS SCHEDULER_ID
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = "FITNESS_DB_TEST"
        AND TABLE_NAME = "ADMINISTRATOR") A,
    (SELECT PERSON_ID FROM PERSON WHERE PERSON_TYPE = "Administrator") P
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM ADMINISTRATOR;
ALTER TABLE ADMINISTRATOR AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- ADMINISTRATOR TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- PATIENT TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS PATIENT;

-- -- CREATING THE TABLE -- --
CREATE TABLE PATIENT
(
    PATIENT_ID INT NOT NULL AUTO_INCREMENT,
    PERSON_ID INT NOT NULL,
    PATIENT_EMAIL VARCHAR(100) NOT NULL,
    PATIENT_PHONE VARCHAR(20) NOT NULL,
    PATIENT_NOTES VARCHAR(300),
    PRIMARY KEY (PATIENT_ID),
    FOREIGN KEY (PERSON_ID) REFERENCES PERSON(PERSON_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO PATIENT VALUES
(1, 3, "testing@gmail.com", "012-345-6789", NULL)
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM PATIENT;
ALTER TABLE PATIENT AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- PATIENT TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- THERAPIST TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS THERAPIST;

-- -- CREATING THE TABLE -- --
CREATE TABLE THERAPIST
(
    THERAPIST_ID INT NOT NULL AUTO_INCREMENT,
    PERSON_ID INT NOT NULL,
    -- CHECK IF THIS NEEDS TO BE MADE NOT NULL (I.E. CLIENT REQUIREMENT)
    THERAPIST_EMAIL VARCHAR(100),
    -- CHECK IF THIS NEEDS TO BE MADE NOT NULL (I.E. CLIENT REQUIREMENT)
    THERAPIST_PHONE VARCHAR(20) NOT NULL,
    PRIMARY KEY (THERAPIST_ID),
    FOREIGN KEY (PERSON_ID) REFERENCES PERSON(PERSON_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO THERAPIST VALUES
(1, 4, NULL, "012-345-6789")
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM THERAPIST;
ALTER TABLE THERAPIST AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- THERAPIST TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- LOGIN_INFORMATION TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS LOGIN_INFORMATION;

-- -- CREATING THE TABLE -- --
CREATE TABLE LOGIN_INFORMATION
(
    PERSON_ID INT NOT NULL,
    USERNAME VARCHAR(30) NOT NULL,
    USER_PASSWORD VARCHAR(30) NOT NULL,
    PRIMARY KEY (PERSON_ID),
    FOREIGN KEY (PERSON_ID) REFERENCES PERSON(PERSON_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO LOGIN_INFORMATION VALUES
(1, "SCHEDULER", "123"),
(2, "ADMINISTRATOR", "456"),
(4, "THERAPIST", "789")
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM LOGIN_INFORMATION;

-- ------------------------------------------------------
-- -- LOGIN_INFORMATION TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- SCHEDULE TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS SCHEDULE;

-- -- CREATING THE TABLE -- --
CREATE TABLE SCHEDULE
(
    SCHEDULE_ID INT NOT NULL AUTO_INCREMENT,
    THERAPIST_ID INT NOT NULL,
    SCHEDULE_DAY DATE NOT NULL,
    SCHED_START_TIME TIME NOT NULL,
    SCHED_END_TIME TIME NOT NULL,
    PRIMARY KEY (SCHEDULE_ID),
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO SCHEDULE VALUES
(1, 1, "2024-09-01", "13:00:00", "15:00:00")
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM SCHEDULE;
ALTER TABLE SCHEDULE AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- SCHEDULE TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- CERTIFICATIONS TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS CERTIFICATIONS;

-- -- CREATING THE TABLE -- --
CREATE TABLE CERTIFICATIONS
(
    THERAPY_TYPE VARCHAR(30) NOT NULL,
    CERT_NAME VARCHAR(15) NOT NULL,
    CERT_DEFINITION VARCHAR(100) NOT NULL,
    PRIMARY KEY (THERAPY_TYPE)
)
;

-- -- TEST VALUES -- --
INSERT INTO CERTIFICATIONS VALUES
("Exercise Therapy", "AET", "Advanced Exercise Therapist")
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM CERTIFICATIONS;

-- ------------------------------------------------------
-- -- CERTIFICATIONS TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- PATIENT_APPOINTMENT TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS PATIENT_APPOINTMENT;

-- -- CREATING THE TABLE -- --
CREATE TABLE PATIENT_APPOINTMENT
(
    APPT_ID INT NOT NULL AUTO_INCREMENT,
    PATIENT_ID INT NOT NULL,
    THERAPIST_ID INT NOT NULL,
    APPT_DAY DATE NOT NULL,
    APPT_START_TIME TIME NOT NULL,
    APPT_END_TIME TIME NOT NULL,
    THERAPY_TYPE VARCHAR(30) NOT NULL,
    APPT_NOTES VARCHAR(300),
    PRIMARY KEY (APPT_ID),
    FOREIGN KEY (PATIENT_ID) REFERENCES PATIENT(PATIENT_ID) ON DELETE CASCADE,
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE,
    FOREIGN KEY (THERAPY_TYPE) REFERENCES CERTIFICATIONS(THERAPY_TYPE) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO PATIENT_APPOINTMENT VALUES
(1, 1, 1, "2024-09-01", "13:00:00", "14:00:00", "Exercise Therapy", NULL)
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM PATIENT_APPOINTMENT;
ALTER TABLE PATIENT_APPOINTMENT AUTO_INCREMENT = 1;

-- ------------------------------------------------------
-- -- PATIENT_APPOINTMENT TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- THERAPIST_CERTIFICATIONS TABLE COMMANDS ----
-- ------------------------------------------------------

-- -- DELETING THE TABLE IF NECESSARY -- --
DROP TABLE IF EXISTS THERAPIST_CERTIFICATIONS;

-- -- CREATING THE TABLE -- --
CREATE TABLE THERAPIST_CERTIFICATIONS
(
    THERAPIST_ID INT NOT NULL,
    -- CHAR COULD BE 'Y', 'N' / NULL
    AET CHAR(1),
    CAPP_OB CHAR(1),
    CAPP_PELVIC CHAR(1),
    CHT CHAR(1),
    CKTP CHAR(1),
    CLT CHAR(1),
    CREX CHAR(1),
    CSCS CHAR(1),
    CYT CHAR(1),
    GCS CHAR(1),
    LMT CHAR(1),
    OCS CHAR(1),
    PAS CHAR(1),
    PCS CHAR(1),
    SCS CHAR(1),
    WCS CHAR(1),
    PRIMARY KEY (THERAPIST_ID),
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE
)
;

-- -- TEST VALUES -- --
INSERT INTO THERAPIST_CERTIFICATIONS (THERAPIST_ID, AET) VALUES
(1, 'Y')
;

-- -- CLEARING THE TABLE IF NECESSARY -- --
DELETE FROM THERAPIST_CERTIFICATIONS;

-- ------------------------------------------------------
-- -- THERAPIST_CERTIFICATIONS TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- DEFAULT_SCHEDULE TABLE COMMANDS ----
-- ------------------------------------------------------

DROP TABLE IF EXISTS DEFAULT_SCHEDULE;

CREATE TABLE DEFAULT_SCHEDULE
(
	THERAPIST_ID INT NOT NULL,
    MON_START_TIME TIME,
    MON_END_TIME TIME,
    TUE_START_TIME TIME,
    TUE_END_TIME TIME,
    WED_START_TIME TIME,
    WED_END_TIME TIME,
    THU_START_TIME TIME,
    THU_END_TIME TIME,
    FRI_START_TIME TIME,
    FRI_END_TIME TIME,
    SAT_START_TIME TIME,
    SAT_END_TIME TIME,
    PRIMARY KEY (THERAPIST_ID),
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE
)
;

INSERT INTO DEFAULT_SCHEDULE VALUES
(25, "12:00:00", "17:00:00", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)
;

DELETE FROM DEFAULT_SCHEDULE;

-- ------------------------------------------------------
-- -- DEFAULT_SCHEDULE TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- THERAPIST_APPOINTMENTS TABLE COMMANDS ----
-- ------------------------------------------------------

DROP TABLE IF EXISTS THERAPIST_APPOINTMENTS;

CREATE TABLE THERAPIST_APPOINTMENTS
(
	THERAPIST_ID INT NOT NULL,
    APPT_LIST VARCHAR(16000),
    PRIMARY KEY (THERAPIST_ID),
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE
);

INSERT INTO THERAPIST_APPOINTMENTS VALUES
(5,NULL);

DELETE FROM THERAPIST_APPOINTMENTS;

-- ------------------------------------------------------
-- -- THERAPIST_APPOINTMENTS TABLE COMMANDS ----
-- ------------------------------------------------------

-- ------------------------------------------------------
-- -- THERAPIST_RATINGS TABLE COMMANDS ----
-- ------------------------------------------------------

DROP TABLE IF EXISTS THERAPIST_RATINGS;

CREATE TABLE THERAPIST_RATINGS
(
	THERAPIST_ID INT NOT NULL,
    THERAPIST_RATING DECIMAL(4,3),
    THERAPIST_REVIEWS int,
    PRIMARY KEY (THERAPIST_ID),
    FOREIGN KEY (THERAPIST_ID) REFERENCES THERAPIST(THERAPIST_ID) ON DELETE CASCADE
)
;

INSERT INTO THERAPIST_RATINGS VALUES
(5,NULL,NULL);

DELETE FROM THERAPIST_RATINGS;

-- ------------------------------------------------------
-- -- THERAPIST_RATINGS TABLE COMMANDS ----
-- ------------------------------------------------------