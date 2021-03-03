-- id, first_name, last_name, title, department, salary, manager_id

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jan", "Smith", 2, 3); 

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Software Engineer", 150000, 10);

INSERT INTO department (id, name)
VALUES (10, "Engineering");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Joe", "Michaels", 4, 5); 

INSERT INTO role (id, title, salary, department_id)
VALUES (4, "Lead Engineer", 250000, 10);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, "Sunny", "Chan", 7, 8); 

INSERT INTO role (id, title, salary, department_id)
VALUES (7, "HR Manager", 200000, 11);

INSERT INTO department (id, name)
VALUES (11, "Human Resources");

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, "Bob", "Dillon", 15, 16); 

INSERT INTO role (id, title, salary, department_id)
VALUES (15, "General Manager", 300000, 12);

INSERT INTO department (id, name)
VALUES (12, "Management Team");