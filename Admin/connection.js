const mysql = require('mysql');
require('dotenv').config();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bookingadmin"
});

con.connect(function(err) {
    if(err) throw err;
    console.log("Database connected Successfully");
});

con.query('SELECT * FROM booking', (err, results, fields) => {
    if (err) throw err;
    console.log(results);
  });

con.query('SELECT * FROM ticketgeneratortable', (err, results, fields) => {
    if (err) throw err;
    console.log(results);
});

module.exports = con;