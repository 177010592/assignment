/* init module */
const url = 'http://api.openweathermap.org/data/2.5/weather';
const collectionName = 'weathers';
const dataSource = require('./dataSource');
const collection = dataSource.model(collectionName, {
	id: { type: Number },
	name: { type: String },
	weather: { type: Array },
	main: { type: Object },
	sys: { type: Object },
	dt: { type: Number },
	date: { type: String }
});

/* search query parameter convert*/
var filerItemIndex = function(json){
	var result = {};
	result.id = json.id;
	result.name = json.name;
	result.weather = json.weather;
	result.main = json.main;
	result.sys = json.sys;
	result.coord = json.coord;
	result.dt = json.dt;
	result.date = json.date;
	return result;
}

var convertIndex = function(strIndex, strValue, mode){
	if(mode == 'api'){
		if(strIndex == "name" ) strIndex = "q";
		return strIndex;
	} else if(mode == 'db') {
		if(strIndex == "q" || strIndex == "name" ) strIndex = "name";
		return strIndex;
	} else {
		return null;
	}
}

var convertValue = function(strIndex, strValue, mode){
	if(mode == 'api'){
		return strValue;
	} else if(mode == 'db') {
		if(strIndex == "id") strValue = parseInt(strValue);
		if(strIndex == "q" || strIndex == "name" ) strValue = new RegExp('^' + strValue + '$', 'i');
		return strValue;
	} else {
		return null;
	}
}

/* exports funtion */
exports.query = function(req, res) {
	//get parameters
	var strIndex = req.params.strIndex;
	var strValue = req.params.strValue;
    var dbIndex = convertIndex(strIndex, strValue, 'db');
    var dbValue = convertValue(strIndex, strValue, 'db');
	var apiIndex = convertIndex(strIndex, strValue, 'api');
	console.log('find ' + strIndex + " - " + strValue);

	//Set db searching base
	var dbQuery = {}; 
	dbQuery[dbIndex] = dbValue;
	
	//Set api searching base
	var apiQuery = { units: 'metric', appid: "44c39f3fa462f86b3fc88f5678e5c5ff"};
	apiQuery[apiIndex] = req.params.strValue;
	
	//dataSource.db.collection(collectionName, function(err, collection) {
		collection.findOne(dbQuery, function(err, item) {
			if (err) { //return error message if something wrong with MongoDB
				console.log(err);
				res.jsonp(err);
			} else if (item) { //return item if it can be found on MongoDB
				if(item.date < dayStr()){ //Check the data date with current
					console.log("Get by API - 1");
					callAPI(req, res, item.date, dbQuery, apiQuery); // Call and get the item from API
				} else {
					console.log("Get by Database");
					res.jsonp(item);
				}
			} else { // Call and get the item from API
				console.log("Get by API - 2");
				callAPI(req, res, null, dbQuery, apiQuery);
			}
        });
    //});
}

/* common function*/
var callAPI = function(req, res, date, dbQuery, apiQuery) {
	//Send request
	var request = require('request');
 	request.get({url: url, qs: apiQuery}, function(err, resq, result) {
		if (err) { //return error message if something wrong with API call
			console.log(err);
			res.jsonp(err);
		} else { //return item if it can be found by API
			//get all data
			var json = JSON.parse(result);
			if(json.cod == '200'){
				//filter data
				var item = filerItemIndex(json);
				item['date'] = date;
				insertDB(item, dbQuery);
				res.jsonp(item); //return item
			} else {
				res.jsonp(json); //return item
			}
		}
	})
}

var insertDB = function(item, dbQuery){ //data insert or update
	var d = dayStr();
	if(item.date <= dayStr()){ //Check the data date with current
		console.log("DB update");
		item['date'] = d;
		//dataSource.db.collection(collectionName, function(err, collection) {
			collection.update(dbQuery, item, function(err, res) {
				if (err) {
					console.log(err);
					res.jsonp(err);
				} else {
					console.log("1 document updated");
				}
			});
		//});
	} else {
		console.log("DB insert");
		item['date'] = d;
		//dataSource.db.collection(collectionName, function(err, collection) {
			//collection.insert(item, {safe:true}, function(err, result) {});
			collection.create(item, {safe:true}, function(err, result) {});
		//});
	}
}

function dayStr() {
	var d= new Date();
	var dStr = d.toISOString().substring(0, 10);
	return dStr;
}