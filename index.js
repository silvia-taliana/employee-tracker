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
};