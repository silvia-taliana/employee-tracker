const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

// connecting to mysql
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'root',
    database: 'employees_db',
});

// determining if there are any connection errors, if not, starting the application
connection.connect((err) => {
    if (err) throw err;
    start();
});

// starting menu
const start = () => {
    console.log("successfully started my function")
    inquirer.prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
            'Add an employee',
            'View all employees',
            'View employees by department',
            'View employees by role',
            'View employees by manager',
            'Update an employee\'s role'
        ]
    }).then((answer) => {
        switch (answer.action) {
            case 'Add an employee':
                addEmployee();
                break;

            case 'View all employees':
                viewEmployees();
                break;

            case 'View employees by department':
                getDepartment();
                break;

            case 'View employees by role':
                getTitle();
                break;

            case 'View employees by manager':
                viewEmpByMan();
                break;

            case 'Update an employee\'s role':
                getEmployee();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
};

// function to add a new employee
const addEmployee = () => {
    inquirer
        .prompt([
            {
                name: 'firstname',
                type: 'input',
                message: 'What is their first name?',
            },
            {
                name: 'lastname',
                type: 'input',
                message: 'What is their last name?',
            },
            {
                name: 'role',
                type: 'list',
                message: 'What is their role?',
                choices: [
                    '101',
                    '102',
                    '103'
                ],
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is their manager?',
                choices: [
                    '1',
                    '2',
                    '3'
                ],
            }
        ]).then((answer) => {
            const query = 'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (5, ?, ?, ?, ?);';
            connection.query(query, [answer.firstname, answer.lastname, answer.role, answer.manager], (err, res) => {
                if (err) throw err;
                console.log('Employee added');
                start();
            });
        });
};

// function to view all employees
const viewEmployees = () => {
    console.log("Employees viewed!");
    let query = 'SELECT employee.id AS ID, employee.first_name AS "First Name", employee.last_name AS "Last Name", role.title AS Tilte, role.salary AS Salary, department.name AS Department, CONCAT(manager.first_name, " ", manager.last_name) AS Manager FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id;';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);

        start();
    });
};

// selecting all departments in the database
const getDepartment = () => {
    let query = 'SELECT name FROM department;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesD = res.map(a => a.name); // reading object values and saving in an array
        viewEmpByDep(choicesD);
    });
};

// function to view employee by department
const viewEmpByDep = (choicesD) => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'Please choose a department',
        choices: choicesD
    }).then((answer) => {
        console.log("Employees viewed by department!");
        let query = 'SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.title AS Title FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id WHERE department.name=?;';
        connection.query(query, [answer.department], (err, res) => {
            if (err) throw err;

            console.table(res);

            start();
        });
    });
};

// selecting all departments in the database
const getTitle = () => {
    let query = 'SELECT title FROM role;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesT = res.map(a => a.title); // reading object values and saving in an array

        // Removing duplicate roles from the database
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        choicesT = removeDuplicates(choicesT);
        viewEmpByRole(choicesT);
    });
};

// function to view employee by department
const viewEmpByRole = (choicesT) => {
    inquirer.prompt({
        name: 'title',
        type: 'list',
        message: 'Please choose a role',
        choices: choicesT
    }).then((answer) => {
        console.log("Employees viewed by role!");
        let query = 'SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id WHERE role.title=?;';
        connection.query(query, [answer.title], (err, res) => {
            if (err) throw err;

            console.table(res);

            start();
        });
    });
};

// Function to view employee by manager
const viewEmpByMan = () => {
    // console.log("Employees viewed by manager!");
    // let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id;';
    // connection.query(query, (err, res) => {
    //     if (err) throw err;

    //     console.table(res);

    start();
    // });
};

// selecting all employees in the database
const getEmployee = () => {
    let query = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesE = res.map(a => a.employee); // reading object values and saving in an array
        getRoles(choicesE);
    });
};

// selecting all roles from the database
const getRoles = (choicesE) => {
    let query = 'SELECT title FROM role;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesR = res.map(a => a.title); // reading object values and saving in an array
        updateEmployeeRole(choicesE, choicesR);
    });
};

// allowing user to choose an employee and their updated role
const updateEmployeeRole = (choicesE, choicesR) => {
    inquirer.prompt([
        {
            name: 'chooseEmployee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: choicesE,
        },
        {
            name: 'newrole',
            type: 'list',
            message: 'Which new role would you like to assign to this employee?',
            choices: choicesR
        }
    ]).then((answer) => {
        const query = 'UPDATE employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id SET role.title=? WHERE CONCAT(employee.first_name, " ", employee.last_name)=?;';
        connection.query(query, [answer.newrole, answer.chooseEmployee], (err, res) => {
            if (err) throw err;
            console.log("Employee role updated!");
            start();
        });
    });
};