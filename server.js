var express = require('express'),
    employees = require('./routes/employees'),
    app = express(),
    cors = require('cors');

app.use(express.static('www'));
// CORS http://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/employees', employees.findAll);
app.get('/employees/:id', employees.findById);
app.get('/employees/:id/reports', employees.findReports);

app.set('port', process.env.PORT || 5000);

app.use(cors());


app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


//app.set('port', process.env.PORT || 8081);