var express = require('express')
var router = express.Router();

var expressJwt = require('express-jwt');
var guard = require('express-jwt-permissions')();

const user = require('./').user;

// define the home page route
router.get('/', function (req, res) {
  res.send('User home page')
})

// define the about route
router.post('/register', user.register);
router.post('/login', user.authenticate);

router.get('/userDetails/:email', expressJwt({secret:'secretKey'}), user.getUser);
router.get('/allUserDetails', expressJwt({secret:'secretKey'}), guard.check('Admin'), user.getAllUsers);

module.exports = router