var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";

	MongoClient.connect(url,{ useNewUrlParser: true }, function(err, db) {
	if (err) throw err;
	var dbo = db.db("mydb");
	var myobj = [
	 { name: 'John', address: 'Highway 71'},
	 { name: 'Peter', address: 'Lowstreet 4'},
	 { name: 'Amy', address: 'Apple st 652'},
	 { name: 'Hannah', address: 'Mountain 21'},
	 { name: 'Michael', address: 'Valley 345'}	
	];
	dbo.collection("customers").insertMany(myobj, function(err, res) {
	 if (err) throw err;
	console.log(res.ops)
	db.close();
	});
	});
