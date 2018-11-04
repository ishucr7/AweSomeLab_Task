var express = require('express');
var app = express();

var fs = require("fs");

var bodyParser = require('body-parser');
var multer  = require('multer');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/home.htm', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "home.htm" );
})
app.get('/add_user.htm', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "add_user.htm" );
})
app.get('/delete_user.htm', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "delete_user.htm" );
})
app.get('/update_user.htm', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "update_user.htm" );
})
app.get('/get_details.htm', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "get_details.htm" );
})

app.get('/', function (req, res) {
  res.sendFile( __dirname + "/templates/" + "home.htm" );
})
// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})


var mysql = require('mysql')
// This file contains the configuration required for the database.
var config  = require('./config.js');
var connection = mysql.createConnection(config);

// idu is the procedure indicating insert, delete, and update
// It takes 4 arguments. The first being the type of action
// 2 -- Roll Number
// 3 -- First Name
// 4 -- Last Name

var sql = `CALL idu(?, ?, ?, ?)`;


app.post('/add_user', urlencodedParser, function (req, res) {
    connection.query(sql, ["insert",req.body.roll_no,req.body.first_name,req.body.last_name],
    function(err, results) {
      if (err) {
        var response="The entry with the same roll number already exists";
        console.log(response);
        res.end(JSON.stringify(response));
      }
      else {
        response = {
          roll_no: req.body.roll_no,
          first_name: req.body.first_name,
          last_name: req.body.last_name
        };
        console.log("Inserted the element with Roll Number " + req.body.roll_no);
        console.log(response);
        res.end(JSON.stringify(response));
      }
    })
})


app.post('/update_user', urlencodedParser, function (req, res) {
    connection.query(sql, ["update",req.body.roll_no,req.body.first_name,req.body.last_name],
    function(err, results) {
      console.log(results);
      if(results.affectedRows == 0)
      {
        response = "The element does not exist";
        console.log(response);
        res.end(JSON.stringify(response));
      }
      else {
        response = {
          roll_no: req.body.roll_no,
          first_name:req.body.first_name,
          last_name:req.body.last_name
        };
        console.log("Updated the element with Roll Number " + req.body.roll_no);
        res.end(JSON.stringify(response));
      }
    })
})


app.post('/delete_user', urlencodedParser, function (req, res) {
  connection.query(sql, ["delete",req.body.roll_no,'',''], function(err, results) {
    if(results.affectedRows == 0)
    {
      response = "The element does not exist";
      console.log(response);
      res.end(JSON.stringify(response));
    }
    else {
      var response = {
        roll_no: req.body.roll_no,
        first_name:req.body.first_name,
        last_name:req.body.last_name
      };
      console.log("Deleted the element with Roll Number " + req.body.roll_no);
      console.log(response);
      res.end(JSON.stringify(response));
    }
  })
})


var list_user = `CALL list_user(?)`;

app.post('/get_details', urlencodedParser, function (req, res) {

  var get_details = function(Roll_no) {
    return new Promise(function(resolve,reject) {
      connection.query(list_user, Roll_no, function(err, results) {
        if (err) {
          return console.error(err.message);
        }
        if(results[0].length == 0) {
          response = "The element does not exist";
          console.log("The element does not exist");
          reject(response);
        }
        else {
          console.log(results[0][0])
          var response = {
            roll_no: Roll_no,
            first_name:results[0][0].FirstName,
            last_name:results[0][0].LastName
         };
        resolve(response);
        }
    })
  })
};
get_details(req.body.roll_no).then(function (response) {
  console.log(response);
  res.end(JSON.stringify(response));
  }, function(error_message) {
    console.log(error_message);
    res.end(JSON.stringify(error_message));
  })
})


var list_users = `CALL list_users()`;

app.get('/list_all', urlencodedParser, function (req, res) {
    var responses=[]
    var get_all = function() {
      return new Promise(function(resolve,reject) {
      connection.query(list_users, function(err, results) {
        if (err) {
          return console.error(err.message);
        }
        console.log(results);
        if(results[0].length != 0) {

          console.log(results[0]);
          console.log(results[0].length)
          for(i=0;i<results[0].length;i++){
            var response = {}
            response.roll_no = results[0][i].RollNo
            response.first_name=results[0][i].FirstName 
            response.last_name=results[0][i].LastName 
            responses.push(response)
          }
          resolve(responses);
        }
        else
        {
          response="List is empty";
          reject(response);
        }
        })
    })
  };
  get_all().then(function (responses) {
    console.log(responses);
    res.end(JSON.stringify(responses));
  }, function (message) {
    console.log(message);
    res.end(JSON.stringify(message));
  })
})
