var mysql = require('promise-mysql');
var promise = require('bluebird');
var db = require('../helpers/db');

var bookAppointment = function(req,res,next){

    console.log('In booking appointment');
    
    //let date = new Date(req.body.appointment_datetime);
    // let appointment_datetime = date.getFullYear() + '-' +
    // ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    // ('00' + date.getDate()).slice(-2) + ' ' + 
    // ('00' + date.getHours()).slice(-2) + ':' + 
    // ('00' + date.getMinutes()).slice(-2) + ':' + 
    // ('00' + date.getSeconds()).slice(-2);
    let appointment_datetime = req.body.appointment_datetime;

    db.isUserExist(req.body)   
    .then(userData => {
        console.log(userData);

        if(userData.length){ //If user already exist return existing userData
            return new Promise((resolve, reject) => { 
                return resolve(userData[0]);
            })
        }else{  // Add new user       
            return db.addNewUser(req.body)   
        }         
    })       
    .then(result => {
        console.log('insert result is', result);       
        return db.addNewAppointment(result.id || result.insertId, appointment_datetime);
    })
    .then(results => {
        console.log('insert result is', results);
        return res.send(results);       
    })
    .catch(err => {
        console.log('error is', err);       
        return res.send(err)
    });
}


var listAppointments = function(req,res,next){
    console.log('In list appointments');
    let appointments_date = req.params.date;
    
    db.listAppointments(appointments_date)    
    .then(result => {        
        return res.send(result);
    })
    .catch(err => {
        console.log('error is', err);        
        return res.send(err)
    });
}

module.exports = {
    bookAppointment : bookAppointment,
    listAppointments : listAppointments
}
