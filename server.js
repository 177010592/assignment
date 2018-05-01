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

//Server Start
app.listen(port);
console.log('Listening on port ' + port + '...');
