DROP DATABASE IF EXISTS employees_db;
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
	ON UPDATE CASCADE
	ON DELETE SET NULL
);

CREATE TABLE employee (
id INT NOT NULL,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NULL,
manager_id INT NULL,
PRIMARY KEY (id),
FOREIGN KEY (manager_id) REFERENCES employee(id)
	ON UPDATE CASCADE
	ON DELETE SET NULL,
FOREIGN KEY (role_id) REFERENCES role(id)
	ON UPDATE CASCADE
	ON DELETE SET NULL
);

-- view all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name
FROM employee
LEFT JOIN role ON role.id=employee.role_id
LEFT JOIN department ON role.department_id=department.id
LEFT JOIN employee AS manager ON employee.manager_id=manager.id;

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;