/* init module */
const collectionName = 'favourites';
const userCollectionName = 'users';
const dataSource = require('./dataSource');
const collection = dataSource.model(collectionName, {
	email: { type: String },
	cityname: { type: String }
});
const userCollection = dataSource.model(userCollectionName);

exports.getList = function(req, res) {
	//get parameters
	var email = req.params.email;
	var password = req.params.password;
	console.log("Get Favourites : " + email);

	//Set db searching base
	var item = {}; 
	item['email'] = email;

	//Check Login
	//dataSource.db.collection(userCollectionName, function(err, collection) {
		userCollection.findOne(item, function(err, result) {
			if (err) {
				console.log(err);
				res.jsonp(["0","Get Favourites Fail: DB Error"]);
			} else if (result) { 
				if(result.password == password){
					//Check Favourites
					//dataSource.db.collection(collectionName, function(err, collection) {
				        collection.find(item, function(err, result) {
				        	if (err) {
								console.log(err);
								res.jsonp(["0","Get Favourites Fail: DB Error"]);
							} else if (result) { 
								console.log("Get Favourites Success");
								res.jsonp(["1",result]);
							} else {
								console.log("Get Favourites Fail: Record Not Found");
								res.jsonp(["0","Get Favourites Fail: Record Not Found"]);
							}
				        });
				    //});
				}else{
					console.log("Wrong Password");
					res.jsonp(["0","Get Favourites Fail: Wrong Password"]);
				}
			} else { 
				console.log("User not found");
				res.jsonp(["0","Get Favourites Fail: User not found"]);
			}
        });
    //});
}

exports.add = function(req, res) {
	//get parameters
	var email = req.params.email;
	var cityname = req.params.cityname;
	var password = req.params.password;
	console.log("Add Favourites : " + email + " - " + cityname);

	//Set db searching base
	var user = {}; 
	user['email'] = email;

	var item = {}; 
	item['email'] = email;
	item['cityname'] = cityname;

	//Check Login
	//dataSource.db.collection(userCollectionName, function(err, collection) {
        userCollection.findOne(user, function(err, result) {
			if (err) {
				console.log(err);
				res.jsonp(["0","Add Favourites Fail: DB Error"]);
			} else if (result) { 
				if(result.password == password){
					//Check Favourites
					//dataSource.db.collection(collectionName, function(err, collection) {
				        collection.findOne(item, function(err, result) {
				        	if (err) {
								console.log(err);
								res.jsonp(["0","Add Favourites Fail: DB Error"]);
							} else if (result) { 
								console.log("Add Favourites Fail: Record Exist");
								res.jsonp(["0","Add Favourites Fail: Record Exist"]);
							} else {
								//Add Favourites
								//dataSource.db.collection(collectionName, function(err, collection) {
									//collection.insert(item, {safe:true}, function(err, result) {
									collection.create(item, {safe:true}, function(err, result) {
										if (err) {
											console.log(err);
											res.jsonp("0");
										} else {
											console.log("Favourites Created - " + email);
											res.jsonp(["1", "Add Favourites Success"]);
										}
									});
								//});
							}
				        });
				    //});
				}else{
					console.log("Wrong Password");
					res.jsonp(["0","Add Favourites Fail: Wrong Password"]);
				}
			} else { 
				console.log("User not found");
				res.jsonp(["0","Add Favourites Fail: User not found"]);
			}
        });
    //});
}

exports.remove = function(req, res) {
	//get parameters
	var email = req.params.email;
	var cityname = req.params.cityname;
	var password = req.params.password;
	console.log("Remove Favourites : " + email + " - " + cityname);

	//Set db searching base
	var user = {}; 
	user['email'] = email;

	var item = {}; 
	item['email'] = email;
	item['cityname'] = cityname;

	//Check Login
	//dataSource.db.collection(userCollectionName, function(err, collection) {
		userCollection.findOne(user, function(err, result) {
			if (err) {
				console.log(err);
				res.jsonp(["0","Remove Favourites Fail: DB Error"]);
			} else if (result) { 
				if(result.password == password){
					//Check Favourites
					//dataSource.db.collection(collectionName, function(err, collection) {
				        collection.findOne(item, function(err, result) {
				        	if (err) {
								console.log(err);
								res.jsonp(["0","Remove Favourites Fail: DB Error"]);
							} else if (result) { 
								//Remove Favourites
								//dataSource.db.collection(collectionName, function(err, collection) {
									collection.remove(item, function(err, result) {
										if (err) {
											console.log(err);
											res.jsonp("0");
										} else {
											console.log("Favourites Removed - " + email);
											res.jsonp(["1", "Remove Favourites Success"]);
										}
									});
								//});
							} else {
								console.log("Remove Favourites Fail: Record Not Exist");
								res.jsonp(["0","Remove Favourites Fail: Record Not Exist"]);
							}
				        });
				    //});
				}else{
					console.log("Wrong Password");
					res.jsonp(["0","Remove Favourites Fail: Wrong Password"]);
				}
			} else { 
				console.log("User not found");
				res.jsonp(["0","Remove Favourites Fail: User not found"]);
			}
        });
    //});
}

