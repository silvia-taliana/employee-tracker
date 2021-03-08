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
            'Add a role',
            'Add a department',
            'View all roles',
            'View all departments',
            'View all employees',
            'View employees by department',
            'View employees by role',
            'View employees by manager',
            'Update an employee\'s role',
            'Update an employee\s manager',
            'Delete a department',
            'Delete a role',
            'Delete an employee',
            'View total utilized budget by department',
            'Exit application'
        ]
    }).then((answer) => {
        switch (answer.action) {
            case 'Add an employee':
                getNewTitle();
                break;

            case 'Add a role':
                getNewDepartment();
                break;

            case 'Add a department':
                getDepId();
                break;

            case 'View all roles':
                viewRoles();
                break;

            case 'View all departments':
                viewDepartments();
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
                managers();
                break;

            case 'Update an employee\'s role':
                getEmployee();
                break;

            case 'Update an employee\s manager':
                chooseEmployee();
                break;

            case 'Delete a department':
                chooseDep();
                break;

            case 'Delete a role':
                chooseRole();
                break;

            case 'Delete an employee':
                chooseEmp();
                break;

            case 'View total utilized budget by department':
                getBudget();
                break;

            case 'Exit application':
                connection.end();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    });
};

// The next few functions will add a new employee
// selecting all roles in the database
const getNewTitle = () => {
    let query = 'SELECT title FROM role;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesT = res.map(a => a.title); // reading object values and saving in an array

        // Removing duplicate roles from the database
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        choicesT = removeDuplicates(choicesT);
        getNewMan(choicesT);
    });
};

// selecting all employees in the database for management assignment
const getNewMan = (choicesT) => {
    let query = 'SELECT CONCAT(first_name, " ", last_name) AS Manager FROM employee;';
    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesM = res.map(a => a.Manager); // reading object values and saving in an array
        addEmployee(choicesT, choicesM);
    });
};

// function to add a new employee
const addEmployee = (choicesT, choicesM) => {
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
                choices: choicesT
            },
            {
                name: 'manager',
                type: 'list',
                message: 'Who is their manager?',
                choices: choicesM
            }
        ]).then((answer) => {
            getNewId(answer);
        });
};

// Getting the new employee ID 
const getNewId = (answer) => {
    let query = 'SELECT id FROM employee;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let newId = res.map(a => a.id); // reading object values and saving in an array

        function sortNumbers(a, b) {
            return a - b;
        }
        newId.sort(sortNumbers); // sorting ID numbers into order from smalles to largest

        const lastItem = newId[newId.length - 1];
        newId = lastItem + 1;
        getNewRoleId(answer, newId);
    });
};

// Geting the new role ID
const getNewRoleId = (answer, newId) => {
    const query = 'SELECT id FROM role WHERE role.title=?;';
    connection.query(query, [answer.role], (err, res) => {
        if (err) throw err;
        let roleId = res.map(a => a.id);
        getManId(answer, newId, roleId)
    });
};

// Getting the new manager ID
const getManId = (answer, newId, roleId) => {
    const query = 'SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id FROM employee LEFT JOIN employee AS manager ON employee.manager_id=manager.id WHERE CONCAT(employee.first_name, " ", employee.last_name)  = ?;';
    connection.query(query, [answer.manager], (err, res) => {
        if (err) throw err;
        let managerId = res.map(a => a.id);
        generateNewEmployee(answer, newId, roleId, managerId)
    });
};

// Putting all the elements together to generate a new employee
const generateNewEmployee = (answer, newId, roleId, managerId) => {
    const query = 'INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (' + newId + ', ?, ?, ' + roleId + ', ' + managerId + ');';
    connection.query(query, [answer.firstname, answer.lastname], (err, res) => {
        if (err) throw err;
        console.log('Employee added');
        start();
    });
};

// next few functions will add a role
// selecting all departments in the database
const getNewDepartment = () => {
    let query = 'SELECT name FROM department;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesD = res.map(a => a.name); // reading object values and saving in an array
        addRole(choicesD);
    });
};

// function to inquirer about new role
const addRole = (choicesD) => {
    inquirer
        .prompt([
            {
                name: 'newRole',
                type: 'input',
                message: 'What role would you like to add?',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the yearly salary for this role?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Which department does this role belong to?',
                choices: choicesD
            }
        ]
        ).then((answer) => {
            const query = 'SELECT id FROM department WHERE department.name=?;';
            connection.query(query, [answer.department], (err, res) => {
                if (err) throw err;
                let depId = res.map(a => a.id);
                getRoleId(answer, depId)
            });
        });
};

// getting the last existing role id and adding one 
const getRoleId = (answer, depId) => {
    let query = 'SELECT id FROM role;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let newRoleId = res.map(a => a.id); // reading object values and saving in an array

        function sortNumbers(a, b) {
            return a - b;
        }
        newRoleId.sort(sortNumbers); // sorting ID numbers into order from smalles to largest

        const lastItem = newRoleId[newRoleId.length - 1];
        newRoleId = lastItem + 1;
        generateNewRole(answer, depId, newRoleId);
    });
};

// putting all these elements together to get a new role with matching salary and department
const generateNewRole = (answer, depId, newRoleId) => {
    const query = 'INSERT INTO role (id, title, salary, department_id) VALUES (' + newRoleId + ', ?, ?, ' + depId + ');';
    connection.query(query, [answer.newRole, answer.salary], (err, res) => {
        if (err) throw err;
        console.log('Role added');
        start();
    });
};

//Next two functions will generate a new department
// getting the last existing department id and adding one 
const getDepId = () => {
    let query = 'SELECT id FROM department;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let newDepId = res.map(a => a.id); // reading object values and saving in an array
        function sortNumbers(a, b) {
            return a - b;
        }
        newDepId.sort(sortNumbers); // sorting ID numbers into order from smalles to largest

        const lastItem = newDepId[newDepId.length - 1];
        newDepId = lastItem + 1;
        addDepartment(newDepId);
    });
};

// function to add department
const addDepartment = (newDepId) => {
    inquirer
        .prompt(
            {
                name: 'newDepartment',
                type: 'input',
                message: 'What department would you like to add?',
            }
        ).then((answer) => {
            const query = 'INSERT INTO department (id, name) VALUES (' + newDepId + ', ?);';
            connection.query(query, [answer.newDepartment], (err, res) => {
                if (err) throw err;
                console.log('Department added');
                start();
            });
        });
};

// function to view all roles
const viewRoles = () => {
    console.log("Roles viewed!");
    let query = 'SELECT title AS Title FROM role;';
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Removing duplicate role ids from the array
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        res = removeDuplicates(res);
        console.table(res);

        start();
    });
};

// function to view all departments
const viewDepartments = () => {
    console.log("Departments viewed!");
    let query = 'SELECT name AS Department FROM department;';
    connection.query(query, (err, res) => {
        if (err) throw err;
        // Removing duplicate role ids from the array
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        res = removeDuplicates(res);
        console.table(res);

        start();
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

// selecting all roles in the database
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

// function to view employee by role
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

//The next few functions will allow user to view employee by manager
// Getting list of managers
const managers = () => {
    let query = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS manager FROM employee;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesMan = res.map(a => a.manager); // reading object values and saving in an array
        managerId(choicesMan);
    });
};

// Getting the manager's ID number
const managerId = (choicesMan) => {
    inquirer.prompt({
        name: 'manager',
        type: 'list',
        message: 'Which manager would you like to choose?',
        choices: choicesMan
    }).then((answer) => {
        let manager = answer.manager;
        let query = 'SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, " ", employee.last_name)="' + manager + '";';
        connection.query(query, (err, res) => {
            if (err) throw err;
            let managerId = res.map(a => a.id);
            viewEmpByMan(managerId);
        });
    });
};

// Function to view employee by manager
const viewEmpByMan = (managerId) => {
    console.log("Employees viewed by manager!");
    let query = 'SELECT employee.id AS ID, CONCAT(employee.first_name, " ", employee.last_name) AS Employee, role.title AS Title FROM employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN employee AS manager ON employee.manager_id=manager.id WHERE manager.id=' + managerId + ';';
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);

        start();
    });
};

// The next few functions are for updating an employee's role
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
        getSalary(answer);
    });
};

// Getting a salary for the chosen role 
const getSalary = (answer) => {
    let query = 'SELECT salary FROM role WHERE title=?;';

    connection.query(query, [answer.newrole], (err, res) => {
        if (err) throw err;
        let newSalary = res.map(a => a.salary); // reading object values and saving in an array
        let newR = answer.newrole;
        getDep(answer, newSalary, newR);
    });
};

// Getting the department for the chosen role
const getDep = (answer, newSalary, newR) => {
    let query = 'SELECT department_id FROM role WHERE title="' + newR + '";';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log(res);
        let updDep = res.map(a => a.department_id); // reading object values and saving in an array
        // Removing duplicate roles from the database
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        updDep = removeDuplicates(updDep);
        updateRole(answer, newSalary, updDep);
    });
};

// Putting all the elements together to update role 
const updateRole = (answer, newSalary, updDep) => {
    const query = 'UPDATE employee LEFT JOIN role ON role.id=employee.role_id LEFT JOIN department ON role.department_id=department.id LEFT JOIN employee AS manager ON employee.manager_id=manager.id SET role.title=?, role.salary=' + newSalary + ', role.department_id=' + updDep + ' WHERE CONCAT(employee.first_name, " ", employee.last_name)=?;';
    connection.query(query, [answer.newrole, answer.chooseEmployee], (err, res) => {
        if (err) throw err;
        console.log("Employee role updated!");
        start();
    });
};

// The next few functions allow user to update the employee's manager
// selecting all employees in the database
const chooseEmployee = () => {
    let query = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesE = res.map(a => a.employee); // reading object values and saving in an array
        chooseManager(choicesE);
    });
};

// Choosing which employee to update and new manager
const chooseManager = (choicesE) => {
    inquirer.prompt([
        {
            name: 'employee',
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: choicesE,
        },
        {
            name: 'manager',
            type: 'list',
            message: 'Please choose a new manager for this employee',
            choices: choicesE,
        }]).then((answer) => {
            // getting manager's ID number
            let manager = answer.manager;
            let employee = answer.employee;
            let query = 'SELECT employee.id FROM employee WHERE CONCAT(employee.first_name, " ", employee.last_name)="' + manager + '";';
            connection.query(query, (err, res) => {
                if (err) throw err;
                let managerId = res.map(a => a.id);
                updateManager(employee, managerId);
            });
        });
};

// Updating manager 
const updateManager = (employee, managerId) => {
    let query = 'UPDATE employee SET employee.manager_id=' + managerId + ' WHERE CONCAT(employee.first_name, " ", employee.last_name)="' + employee + '";';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("Employee's manager has been updated");
        start();
    });
};

// The next few functions allow user to delete a department
// Getting all department names
const chooseDep = () => {
    let query = 'SELECT name FROM department;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesN = res.map(a => a.name); // reading object values and saving in an array
        getDepIdDel(choicesN);
    });
};

// Prompting user to choose department
const getDepIdDel = (choicesN) => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'Which department would you like to delete?',
        choices: choicesN
    }).then((answer) => {
        // Getting id of chosen department
        let dep = answer.department;
        let query = 'SELECT id FROM department WHERE name="' + dep + '";';
        connection.query(query, (err, res) => {
            if (err) throw err;
            let depId = res.map(a => a.id); // reading object values and saving in an array
            // Removing duplicate department ids from the array
            function removeDuplicates(data) {
                return data.filter((value, index) => data.indexOf(value) === index);
            }
            depId = removeDuplicates(depId);
            deleteDep(depId);
        });
    });
};

// Deleting department
const deleteDep = (depId) => {
    let query = 'DELETE FROM department WHERE department.id =' + depId + ';';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("Department has been deleted");
        start();
    });
};

// The next few functions allow user to delete a role
// Getting all roles
const chooseRole = () => {
    let query = 'SELECT title FROM role;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesT = res.map(a => a.title); // reading object values and saving in an array
        // Removing duplicate role ids from the array
        function removeDuplicates(data) {
            return data.filter((value, index) => data.indexOf(value) === index);
        }
        choicesT = removeDuplicates(choicesT);
        getRoleIdDel(choicesT);
    });
};

// Prompting user to choose role
const getRoleIdDel = (choicesT) => {
    inquirer.prompt({
        name: 'title',
        type: 'list',
        message: 'Which role would you like to delete?',
        choices: choicesT
    }).then((answer) => {
        // Getting id of chosen role
        let role = answer.title;
        let query = 'SELECT id FROM role WHERE title="' + role + '";';
        connection.query(query, (err, res) => {
            if (err) throw err;
            let roleId = res.map(a => a.id); // reading object values and saving in an array
            deleteRole(roleId);
        });
    });
};

// Deleting role
const deleteRole = (roleId) => {
    let query = 'DELETE FROM role WHERE role.id =' + roleId + ';';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("Role has been deleted");
        start();
    });
};

// The next few functions allow user to delete an employee
// Getting all employees
const chooseEmp = () => {
    let query = 'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS employee FROM employee;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesE = res.map(a => a.employee); // reading object values and saving in an array
        getEmpId(choicesE);
    });
};

// Prompting user to choose employee
const getEmpId = (choicesE) => {
    inquirer.prompt({
        name: 'employee',
        type: 'list',
        message: 'Which employee would you like to delete?',
        choices: choicesE
    }).then((answer) => {
        // Getting id of chosen employee
        let name = answer.employee;
        let query = 'SELECT id FROM employee WHERE CONCAT(employee.first_name, " ", employee.last_name)="' + name + '";';
        connection.query(query, (err, res) => {
            if (err) throw err;
            let empId = res.map(a => a.id); // reading object values and saving in an array
            deleteEmployee(empId);
        });
    });
};

// Deleting employee
const deleteEmployee = (empId) => {
    let query = 'DELETE FROM employee WHERE employee.id =' + empId + ';';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("Employee has been deleted");
        start();
    });
};

// The next few functions allow the user to view the total utilized budget for a chosen department
// Getting departments
const getBudget = () => {
    let query = 'SELECT name FROM department;';

    connection.query(query, (err, res) => {
        if (err) throw err;
        let choicesN = res.map(a => a.name); // reading object values and saving in an array
        getDepIdBudg(choicesN);
    });
};

// Prompting user to choose department and getting id number for chosen department
const getDepIdBudg = (choicesN) => {
    inquirer.prompt({
        name: 'department',
        type: 'list',
        message: 'Which department\'s budget would you like to view?',
        choices: choicesN
    }).then((answer) => {
        let depName = answer.department;
        let query = 'SELECT id FROM department WHERE name="' + depName + '";';
        connection.query(query, (err, res) => {
            if (err) throw err;
            let depIdBudg = res.map(a => a.id); // reading object values and saving in an array
            viewBudget(depIdBudg);
        });
    });
};

// Viewing budget for chosen department
const viewBudget = (depIdBudg) => {
    let query = 'SELECT SUM(salary) AS "Total Utilized Budget" FROM role WHERE department_id=' + depIdBudg + ';';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};