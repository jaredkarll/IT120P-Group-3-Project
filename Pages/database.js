const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();

app.use(express.static("public"));



var con = require("./connection");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, function () {
    console.log("Server is up and running");
})

app.get("/signup", function (req, res) {
    res.sendFile(__dirname + "/SignUp.html");
})


app.post("/", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    console.log(name, email, password);

    var sql = 'INSERT INTO accounts (Name, Email, Password) VALUES (?)';
    var values = [name, email, password];


    con.query(sql, [values], function (err, result) {
        if (err) throw err;

        console.log("Data Uploaded");
        res.redirect("/");
    })


})


//Login Function
app.get("/login", function (req, res) {
    res.sendFile(__dirname + "/login.html");
});
  

app.post("/login", function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    // Query the database to find the user with the provided email
    pool.query('SELECT * FROM accounts WHERE Email = ?', [email], function (error, results, fields) {
        if (error) {
            console.log(error);
            res.send('An error occurred while fetching user details');
            return;
        }

        // Check if the email exists in the database
        if (results.length == 0) {
            res.send('Email does not exist');
            return;
        }

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, results[0].Password, function (err, result) {
            if (err) {
                console.log(err);
                res.send('An error occurred while checking password');
                return;
            }

            if (result == true) {
                // Passwords match, so the user is authorized
                res.redirect("/Destination/index.html");
            } else {
                // Passwords do not match, so the user is not authorized
                res.send('Incorrect password');
            }
        });
    });
});


app.get("/Destination/index", function (req, res) {
    res.sendFile(__dirname + "/Destination/index.html");
});

app.get("/Admin", function (req, res) {
    res.sendFile(__dirname + "/AdminUI.html");
});

