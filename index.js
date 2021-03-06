const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

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

connection.connect((err) => {
    if (err) throw err;
    start();
});

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
                viewEmpByDep();
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

const viewEmployees = () => {
    console.log("Employees viewed!");
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id;';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);

        start();
    });
};

const viewEmpByDep = () => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'Please choose a department',
        choices: [
            'Engineering',
            'Human Resources',
            'Management Team'
        ]
    }).then((answer) => {
        console.log("Employees viewed by department!");
        let query = 'SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) AS employee, role.title FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id WHERE department.name=?;';
        connection.query(query, [answer.department], (err, res) => {
            if (err) throw err;

            console.table(res);

            start();
        });
    });
};

const viewEmpByMan = () => {
    // console.log("Employees viewed by manager!");
    // let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id;';
    // connection.query(query, (err, res) => {
    //     if (err) throw err;

    //     console.table(res);

    start();
    // });
};


const getEmployee = () => {

    let query = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee;';
    // var choicesE;

    connection.query(query, (err, res) => {
        if (err) throw err;
        // choices = res.map(a => a.employee);
        let choicesE = res.map(a => a.employee);
        updateEmployeeRole(choicesE);
    });
};

const updateEmployeeRole = (choicesE) => {
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
            choices: [
                '101',
                '102',
                '103',
                '104'
            ],
        }
    ]).then((answer) => {
        const query = 'UPDATE employee SET role_id=? WHERE id=?;';
        connection.query(query, [answer.newrole, answer.chooseEmployee], (err, res) => {
            if (err) throw err;
            console.log("Employee role updated!");
            start();
        });
    });
};