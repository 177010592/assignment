
//Init Appication
var express = require('express');
var app = express();
var port = process.env.PORT || 443;


//Object and Funtction
var weather = require('./modules/weather');
var forecast = require('./modules/forecast');
var user = require('./modules/user');
var favourite = require('./modules/favourite');

//Restfull Setting
app.get('/weathers/:strIndex=:strValue', weather.query);
app.get('/forecasts/:strIndex=:strValue', forecast.query);
app.get('/user/login/email=:email&pw=:password', user.login);
app.get('/user/signup/email=:email&pw=:password', user.signup);
app.get('/favourite/add/email=:email&pw=:password&cityname=:cityname', favourite.add);
app.get('/favourite/remove/email=:email&pw=:password&cityname=:cityname', favourite.remove);
app.get('/favourite/getList/email=:email&pw=:password', favourite.getList);

//Server Start
app.listen(port);
console.log('Listening on port ' + port + '...');
favourite