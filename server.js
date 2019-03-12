    /********** DB Zone *************/ 
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var express =require('express');
    var app = express();
    app.use(express.json()); 
    app.use(express.urlencoded({extended: true}));
    var path=require('path');
    var router = express.Router();
    //client will not have permission to client folder only to static
    app.use('/static',express.static(path.join(__dirname,'client')));

    var server=app.listen(3000, ()=> {console.log("server in ...")});

    /** global veriables */
    
    var employesDetails; 

/**
 * 
 * server getting /login req
 * created by leeorr
 * handle request from newlogin page 
 */
app.post('/login' , function(req,res){
  employeeLogin(req.body.WorkerNum,req.body.password, res);
});

 /** employeeLogin
     * by: leeorr h
     * use : check empId and Password, if there is a match we'll continue
     *  */ 
    function employeeLogin(workerNumIn, passwordIn, res){
      MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dataBaseObject = db.db("projDB");
        dataBaseObject.collection('employees').findOne({_id: workerNumIn},
          function(err, result) {
            if (err) throw err;
            if(result === null){
              callback(false, res,null,'login');
            }else if (result._id == workerNumIn && result.password == passwordIn){
              employesDetails = result;
              callback(true, res,result.WorkerName,'login');
            }
            else{
              callback(false, res,null,'login');
            }
            db.close(); 
          });
      });
    }



/** signUp
     * by: leeorr h
     * use : signUp if user not exist
     *  */ 
app.post('/signUp' , function(req,res){
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
       success=false;
     dataBaseObject.collection('employees').findOne({ _id: req.body.workerNum},
       function(err, user) {
             if(user === null){
                dataBaseObject.collection("employees").insertOne({_id:req.body.workerNum, 
                    WorkerName: req.body.workerName,
                    password: req.body.password});
                console.log("user added"); 
                db.close();
                var worker = {
                  'workerNumber' : req.body.workerNum, 
                  'WorkerName' : req.body.workerName,
                  'password' : req.body.password
                };
                callback(true, res,worker,'signUp');
             }else {
              console.log("user exist");
              callback(false, res,user,'signUp');
              db.close();
           }     
    });
  }); 
});

/**
 * returning works List
 */
app.post('/worksList' , function(req,res){
  var resultArr = [] ;
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
     var cursor = dataBaseObject.collection('works').find();
     cursor.forEach(function(doc,err){
      if (err) throw err;
      if(doc === null) callback(false,res,null,'worksList');
      resultArr.push(doc);
     }, function(){
      callback(true,res,resultArr,'worksList');
       db.close();
     });
  });  
});

/**
 * returning customer list
 */
app.post('/customersList' , function(req,res){
  var resultArr = [] ;
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
     var cursor = dataBaseObject.collection('customers').find();
     cursor.forEach(function(doc,err){
      if (err) throw err;
      if(doc === null) callback(false,res,null,'customersList');
      resultArr.push(doc);
     }, function(){
       db.close();
     });
     callback(true,res,resultArr,'customersList');
  });  
});

/**
 * Adding new work 
 */
app.post('/addWork' , function(req,res){
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
    success=false;
    dataBaseObject.collection("works").insertOne({_id:req.body._id, 
    WorkerNumber: req.body.workerNumber, WorkerName: req.body.workerName,
    ClientID: req.body.clientID, CarID: req.body.carID ,CarType : req.body.carType,
    Status : req.body.status , problemDiscription: req.body.problemDiscription , 
    TotalCost: req.body.TotalCost
     });
    console.log("work added"); 
    db.close();
    var workDitails = {
      '_id':req.body._id, 
      'WorkerNumber': req.body.workerNumber,
      'WorkerName': req.body.workerName,
      'ClientID': req.body.clientID,
      'CarID': req.body.carID ,
      'CarType' : req.body.carType,
      'Status': req.body.status ,
      'problemDiscription': req.body.problemDiscription ,
      'TotalCost': req.body.TotalCost
    };
     callback(true, res,workDitails,'addWork');          
  });
});

app.post('/showWorkDetails' , function(req,res){
  var result;
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
     dataBaseObject.collection('works').findOne({_id: req.body._id},
      function(err, work) {
        if (result===null)
          callback(false,res,null,'showWorkDetails');
        else callback(true,res,work,'showWorkDetails');
    });
  });
});

app.post('/upDateWork' , function(req,res){
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dataBaseObject = db.db("projDB");
    success=false;
    var upDateByID = { _id:req.body._id };
    var newvalues = { $set: { 
    WorkerNumber: req.body.workerNumber, WorkerName: req.body.workerName,
    ClientID: req.body.clientID, CarID: req.body.carID ,CarType : req.body.carType,
    Status : req.body.status , problemDiscription: req.body.problemDiscription , 
    TotalCost: req.body.TotalCost
     } };
    dataBaseObject.collection("works").updateOne(upDateByID,newvalues);
    console.log("work upDated"); 
    db.close();
    callback(true,  res,"success",'upDateWork');
  });
});

app.post('/getEmpDetails' , function(req,res){
  callback(true,res,employesDetails,'getEmpDetails');
});


  
  

    function callback(bool, res,obj,message){
      var found = {'success': bool,
                   'message': message,
                   'obj': obj
                  };
      res.send(found);
    }

  


 /**open windows**/
 /**to use this run the server and write localhost3000/.... */
 app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/client/newlogin.html');
});
app.get('/HomePage',(req,res)=>{
  res.sendFile(__dirname+'/client/HomePage.html');
});
app.get('/workList',(req,res)=>{
  res.sendFile(__dirname+'/client/workList.html');
});
app.get('/CostumersList',(req,res)=>{
  res.sendFile(__dirname+'/client/CostumersList.html');
});

app.get('/CostumersList',(req,res)=>{
  res.sendFile(__dirname+'/client/CostumersList.html');
});

   /* GET userlist */
router.get('/worksList', function(req, res) {
var db = req.db;
var collection = db.get('works');
collection.find({},{},function(e,docs){
res.json(docs);
});
});