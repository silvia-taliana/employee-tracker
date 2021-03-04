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

            case 'Update an employee\'s role':
                updateEmployeeRole();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
};

const addEmployee = () => {
    console.log("Employee added!");
    start();
};

const viewEmployees = () => {
    console.log("Employees viewed!");
    let query = 'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id FROM ((role INNER JOIN employee ON role.id=employee.role_id) INNER JOIN department ON role.department_id=department.id);';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);

        start();
    });
};

const updateEmployeeRole = () => {
    console.log("Employee role updated!");
    start();
};