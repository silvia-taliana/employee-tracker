INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Stevie", "Nicks", 101, 2); 

INSERT INTO role (id, title, salary, department_id)
VALUES (101, "Software Engineer", 150000, 201);

INSERT INTO department (id, name)
VALUES (201, "Engineering");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Elvis", "Presley", 102, 4); 

INSERT INTO role (id, title, salary, department_id)
VALUES (102, "Lead Engineer", 250000, 201);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Jackie", "Chan", 103, 4); 

INSERT INTO role (id, title, salary, department_id)
VALUES (103, "HR Manager", 200000, 202);

INSERT INTO department (id, name)
VALUES (202, "Human Resources");

INSERT INTO employee (id, first_name, last_name, role_id)
VALUES (4, "Keanu", "Reeves", 104); 

INSERT INTO role (id, title, salary, department_id)
VALUES (104, "General Manager", 300000, 203);

INSERT INTO department (id, name)
VALUES (203, "Management Team");