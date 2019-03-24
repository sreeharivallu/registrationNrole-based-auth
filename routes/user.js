var mysql = require('promise-mysql');
var promise = require('bluebird');
var jwt = require('jsonwebtoken');
var db = require('../helpers/db');

var register = function(req,res,next){
    var p = db.isUserExist(req.body)
    .then(userData => {
        console.log(userData);

        if(userData.length){ //If user already exist return existing userData
            p.cancel();
            return res.status(400).send('User already exits');                    
        }else{  // Add new user       
            return db.addNewUser(req.body)   
        }         
    })
    .then(userDetails => {
        return res.status(200).json({status: 'success'});
    })
    .catch(err => {
        console.log('Error occured while adding a new user', err);
        return res.status(500).json({success: false, error : {message:"Failed to add user"}});
    })
}

var authenticate = function(req,res,next){    
    getUserDetails(req.body.email)    
    .then(userData => {        
        console.log('userData is', userData[0].role);
        const user = {email : userData.email, permissions: [userData[0].role]};
        const token  = jwt.sign(user, 'secretKey',{expiresIn: 60 * 120});        
        return res.send({token});
    });
}

var getUserDetails = async function(email){
    var userData = await db.getUserDetails(email);   
    return userData;
}

var getUser = function(req,res,next){
    console.log('In getUser');
    getUserDetails(req.params.email)
    .then(userData => {        
        res.status(200).json({status: 'success', data: userData});
    })
    .catch(err => {
        res.status(500).json({success: false, error : {message:"Failed to get user"}});
    })
}

var getAllUsers = function(req,res,next){
    
    db.getAllUserDetails()
    .then(userData => {        
        res.status(200).json({status: 'success', data: userData});
    })
    .catch(err => {
        res.status(500).json({success: false, error : {message:"Failed to get user"}});
    })
}

module.exports = {
    register : register,
    authenticate : authenticate,
    getUser : getUser,
    getUserDetails : getUserDetails,
    getAllUsers : getAllUsers   
}