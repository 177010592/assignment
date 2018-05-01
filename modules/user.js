/* init module */
const collectionName = 'users';
const dataSource = require('./dataSource');
const collection = dataSource.model(collectionName, {
	email: { type: String },
	password: { type: String }
});

/* exports funtion */
exports.login = function(req, res) {
	//get parameters
	var email = req.params.email;
	var password = req.params.password;
	console.log("login : " + email + " - " + password);

	//Set db searching base
	var item = {}; 
	item['email'] = email;

	//Check Login
	//dataSource.db.collection(collectionName, function(err, collection) {
        collection.findOne(item, function(err, result) {
			if (err) {
				console.log(err);
				res.jsonp(["0","Login Fail: DB Error"]);
			} else if (result) { 
				if(result.password == password){
					res.jsonp(["1","Login Success"]);
				}else{
					console.log("Wrong Password");
					res.jsonp(["0","Login Fail: Wrong Password"]);
				}
			} else { 
				console.log("User not found");
				res.jsonp(["0","Login Fail: User not found"]);
			}
        });
    //});
}

exports.signup = function(req, res) {
	//get parameters
	var email = req.params.email;
	var password = req.params.password;
	console.log("Sign up : " + email + " - " + password);

	//Set db searching base
	var item = {}; 
	item['email'] = email;

	//Check Login
	//dataSource.db.collection(collectionName, function(err, collection) {
        collection.findOne(item, function(err, result) {
        	if (err) {
				console.log(err);
				res.jsonp(["0","Sign up Fail: DB Error"]);
			} else if (result) { 
				console.log("Sign up Fail: User Exist");
				res.jsonp(["0","Sign up Fail: User Exist"]);
			} else { 
				//Add Login
				item['password'] = password;
				//dataSource.db.collection(collectionName, function(err, collection) {
					//collection.insert(item, {safe:true}, function(err, result) {
					collection.create(item, {safe:true}, function(err, result) {
						if (err) {
							console.log(err);
							res.jsonp("0");
						} else {
							console.log("User Created - " + email);
							res.jsonp(["1","Sign up Success"]);
						}
					});
				//});
			}
        });
    //});
}
