CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
id INT NOT NULL,
name VARCHAR(30) NULL,
PRIMARY KEY (id)
);

CREATE TABLE role (
id INT NOT NULL,
title VARCHAR(30) NULL,
salary DECIMAL NULL,
department_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INT NOT NULL,
first_name VARCHAR(30) NULL,
last_name VARCHAR(30) NULL,
role_id INT NULL,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES role(id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
FROM ((role
INNER JOIN employee ON role.id=employee.role_id)
INNER JOIN department ON role.department_id=department.id);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;