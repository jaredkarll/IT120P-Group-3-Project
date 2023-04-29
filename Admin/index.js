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

//Booking

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/Booking.html");
});

app.post("/", function (req, res) {
    var bookingFrom = req.body.bookingFrom;
    var bookingTo = req.body.bookingTo;
    var price = req.body.price;
    var code = req.body.code;

    console.log(bookingFrom, bookingTo, price, code);

    var sql = "INSERT INTO booking (FromLoc, ToLoc, price, Code) VALUES (?, ?, ?, ?)";
    var values = [bookingFrom, bookingTo, price, code];

    con.query(sql, values, function (err, result) {
        if (err) throw err;

        console.log("Data Uploaded");
        res.redirect('/');

    });
});

//Ticket Generator

app.get("/ticketgen", function(req,res){
    res.sendFile(__dirname + "/TicketGenerator.html");
})

app.post("/ticketgen", function(req,res){
    var FromDestination= req.body.FromDestination
    var ToDestination= req.body.ToDestination
    var email= req.body.email
  
    console.log(FromDestination,ToDestination,email);
  
    var sql = 'INSERT INTO ticketgeneratortable (FromLocation, ToLocation, emailAdd) VALUES (?, ?, ?)';
    var values =[FromDestination,ToDestination,email];
  
    con.query(sql, [values],function(err,result){
      if (err) throw err;
  
      console.log("Data Uploaded.");
      res.redirect('/');
    })
  });