var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
var routes = require('./routes/routes');

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(function (err, req, res, next) {
    if (err.code === 'permission_denied') {
      res.status(403).send('Forbidden');
    }
});

app.use('/user', routes);

app.get('/', (req, res) => {  
    res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
