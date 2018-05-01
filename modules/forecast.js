//Connect to Openweather API - Forecast
const url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
//Create Collection Name
const collectionName = 'forecasts';
//Initialize dataSource Dir
const dataSource = require('./dataSource');
//Initialize Collection Structure
const collection = dataSource.model(collectionName, {
	city: { type: Object },
	cnt: { type: Number },
	list: { type: Array },
	dt: { type: Number },
	date: { type: String }
});

// Parameter Convert to json format
var filerItemIndex = function(json){
	var result = {};
	result.city = json.city;
	result.cnt = json.cnt;
	result.list = json.list;
	result.dt = json.dt;
	result.date = json.date;
	return result;
}

var convertIndex = function(strIndex, strValue, mode){
	if(mode == 'api'){
		if(strIndex == "id" ) strIndex = "id";
		if(strIndex == "name" ) strIndex = "q";
		return strIndex;
	} else if(mode == 'db') {
		if(strIndex == "id") strIndex = "city.id"; 
		if(strIndex == "q" || strIndex == "name" ) strIndex = "city.name";
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

// Export data from Database
exports.query = function(req, res) {
	//Get Parameters from Database
	var strIndex = req.params.strIndex;
	var strValue = req.params.strValue;
    var dbIndex = convertIndex(strIndex, strValue, 'db');
    var dbValue = convertValue(strIndex, strValue, 'db');
	var apiIndex = convertIndex(strIndex, strValue, 'api');

	//Database Query
	var dbQuery = {}; 
	dbQuery[dbIndex] = dbValue;
	
	//API Query
	var apiQuery = { units: 'metric', appid: "44c39f3fa462f86b3fc88f5678e5c5ff"};
	apiQuery[apiIndex] = req.params.strValue;
	
		//Retrieve Data from Database
		collection.findOne(dbQuery, function(err, item) {
			//Prompt error when MongoDB is error
			if (err) { 
				console.log(err);
				res.jsonp(err);
			//When records can be found in database
			} else if (item) { 
				//Check the record's date with current date
				if(item.date < dayStr()){
					//Record get by API
					console.log("Update forecast from API.");
					//Call API to get the record
					callAPI(req, res, item.date, dbQuery, apiQuery); 
				} 
				//Record get from database
				else {
					console.log("Get forecast from Database.");
					res.jsonp(item);
				}
			} 
			// Call API to get new record that doesnt exist in database
			else {
				console.log("Get forecast from API.");
				// Call API to get the record
				callAPI(req, res, null, dbQuery, apiQuery);
			}
        });
    //});
}

//Call API Function
var callAPI = function(req, res, date, dbQuery, apiQuery) {
	//Send request
	var request = require('request');
 	request.get({url: url, qs: apiQuery}, function(err, resq, result) {
		//Prompt error when API function is error
		if (err) { 
			console.log(err);
			res.jsonp(err);
		//When record can be found in API
		} 
		else { 
			var json = JSON.parse(result);
			if(json.cod == '200'){
				//Filter record with Item Index in josn format
				var item = filerItemIndex(json);
				item['date'] = date;
				//Insert record to database	
				insertDB(item, dbQuery);
				//Response
				res.jsonp(item); 
			} else {
				res.jsonp(json);
			}
		}
	})
}

//Insert record to DB
var insertDB = function(item, dbQuery){
	var d = dayStr();
	//Check the record's date with current date
	if(item.date <= dayStr()){
		//update the record
		item['date'] = d;
		console.log("Latest foreast is updating into database...");

	        collection.update(dbQuery, item, function(err, res) {
				//When updating record meets error
				if (err) {
					console.log(err);
					res.jsonp(err);
				} else {
					//Update Successful
					console.log("Latest weather has been updated.");
				}
			});
	} 
	else { 
		//Record has been inserted to database
		item['date'] = d;
		console.log("Forecast has been inserted into database.");
		collection.create(item, {safe:true}, function(err, result) {});
	}
}

//Current Date Comparison Function
function dayStr() {
	var d= new Date();
	var dStr = d.toISOString().substring(0, 10);
	return dStr;
}