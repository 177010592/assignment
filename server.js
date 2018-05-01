//index.js, start with node index.js, then type in url localhost:port/functions/name=CityName
//Launch express libraries
var express = require('express');
var app = express();
//Listen on Port 443
var port = process.env.PORT || 443;


//Required Functions
var weather = require('./modules/weather');
var forecast = require('./modules/forecast');

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