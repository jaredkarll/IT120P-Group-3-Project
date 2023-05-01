const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const { request } = require('http');
const bodyParser = require("body-parser");

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'admin@010203anapolis0ne',
	database : 'nodelogin'
});

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/ticket.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/public/.css');
  });

// http://localhost:4000/book
app.get('/book', function(request,response){
    response.sendFile(__dirname + "/book.html");
});

app.get('/home', function(request, response){
    response.sendFile(__dirname + "/index.html");
});

app.get('/ticket',  function(request,response){
    var sql = "SELECT * FROM tickets ORDER BY ticket_id DESC LIMIT 1";

    connection.query(sql, function(error, results){
        if(error) throw error;
        const getRow = results[0];
        response.render('ticket', {getRow});
    });
});

//Request the server to get the form
app.post('/book', function(request,response){
    //declare variables 
    let code = Math.floor(1000 + Math.random() * 9000);
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.emailAdd;
    let date = request.body.reserve;
    let contact = request.body.contactNo;
    let selectedFirstLocation = request.body.isFromLoc;
    let selectedLastLocation = request.body.isToLoc;

    //booking is the database table name. Under bookings are the following columns 
    let sql = "INSERT INTO booking(code,first_name, last_name, email, date, contact_num, location_1, location_2) VALUES(?)";
    let priceSql = "SELECT price FROM prices WHERE route_name = ?"
    let val = [code,firstName, lastName, email, date, contact, selectedFirstLocation, selectedLastLocation];
    let priceVal = [selectedLastLocation];
    connection.query(priceSql, priceVal, function(error, results, fields) {
        if(error) throw error;
        console.log(results);
        //Insert to booking database
        connection.query(sql,[val], function(error, results, fields){ 
            if(error) throw error;
            console.log("Inserted");
        });

        //Insert to ticket database
        let price = results[0].price;
        let sqlTicket = "INSERT INTO tickets(code, first_name, last_name, date, f_location, l_location, price) VALUES(?)"
        let ticketVal = [code, firstName, lastName, date, selectedFirstLocation, selectedLastLocation, price];
        connection.query(sqlTicket, [ticketVal], function(error,results, fields){
            if(error) throw error;
            console.log("Ticket has been created");
             // Redirect to ticket after being inserted and the user will print the ticker or screenshot.
            response.redirect('/ticket');
        });
    });
});


app.listen(4000);
