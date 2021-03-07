INSERT INTO department (id, name)
VALUES (201, "Engineering");

INSERT INTO department (id, name)
VALUES (202, "Human Resources");

INSERT INTO department (id, name)
VALUES (203, "Management Team");

INSERT INTO role (id, title, salary, department_id)
VALUES (101, "Software Engineer", 150000, 201);

INSERT INTO role (id, title, salary, department_id)
VALUES (102, "Lead Engineer", 250000, 201);

INSERT INTO role (id, title, salary, department_id)
VALUES (103, "HR Manager", 200000, 202);

INSERT INTO role (id, title, salary, department_id)
VALUES (104, "General Manager", 300000, 203);

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (1, "Stevie", "Nicks", 101); 

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (2, "Elvis", "Presley", 102); 

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (3, "Jackie", "Chan", 103); 

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (4, "Keanu", "Reeves", 104); 

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (5, "Freddy", "Mercury", 101); 

UPDATE employee
SET employee.manager_id = 2
WHERE employee.id = 1; 

UPDATE employee
SET employee.manager_id = 4
WHERE employee.id = 2; 

UPDATE employee
SET employee.manager_id = 4
WHERE employee.id = 3; 

UPDATE employee
SET employee.manager_id = 2
WHERE employee.id = 5; 