CREATE DATABASE AweSomeLab_Task1;
use AweSomeLab_Task1;

DROP TABLE IF EXISTS student;

CREATE TABLE student (
RollNo INT PRIMARY KEY,
FirstName VARCHAR(100),
LastName VARCHAR(100)
);

-- Adding two entries before hand 
INSERT INTO student
VALUES( 1, "Aashish", "Gaba");

INSERT INTO student
VALUES( 2, "Mudit", "Surana");

-- Stored Procedure for Insert Delete Update 
DELIMITER //
CREATE PROCEDURE idu( pAction VARCHAR(100), pRollNo INT,
pFirstName varchar(100), pLastName varchar(100)) 
	BEGIN
		if pAction = "insert" THEN
			INSERT INTO student(RollNo, FirstName, LastName)
            VALUES (pRollNo, pFirstName, pLastName);
		END IF;
    	if pAction = "select" THEN
			SELECT * from student;
		END IF;
		if pAction = "update" THEN
			UPDATE student
			SET FirstName = pFirstName, LastName = pLastName
			WHERE RollNo = pRollNo;
        END IF;
     if pAction = "delete" THEN
			DELETE FROM student
			WHERE RollNo = pRollNo;
		END IF;
	END//
DELIMITER ;

-- Stored procedure for listing the user
DELIMITER //
CREATE PROCEDURE list_user(pRollNo INT) 
	BEGIN
    	SELECT * from student where RollNo = pRollNo;
	END//
DELIMITER ;

-- Stored procedure for listing all users
DELIMITER //
CREATE PROCEDURE list_users() 
	BEGIN
    	SELECT * from student;
	END//
DELIMITER ;
