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
    // success=false;

//   /** mongo connect **/
//     MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
//         if (err) throw err;
//         var dataBaseObject = db.db("projDB");

// //create collections
//         // adding employees collection - table
//         dataBaseObject.createCollection("employees",function(err,res){
//           console.log("employees collection created");
//             //db.close();
//         });  

//         // adding 'works collection - table
//         dataBaseObject.createCollection("works",function(err,res){
//           console.log("works collection created!");
//            // db.close();
//         });    

//         // adding customers collection - table
//         dataBaseObject.createCollection("customers",function(err,res){
//           console.log("customers collection created!");
//           //  db.close();
//         }); 
// /*
// //adding works to works collection        
// var work1 = {
//   _id: "000001",
//   WorkerNumber: "965",
//   WorkerName: "Mark",
//   ClientID: "313124823",
//   CarID: "95-896-78",
//  CerType:"Toyota",
//   Status:  "Pending",
//   problemDiscription: "Driver Seat Recline Position Restraints Sensor",
//   TotalCost: "450$"
//  }; 

//     dataBaseObject.collection("works").insertOne(work1);

//     var work2={
//       _id: '000002',
//       WorkerNumber: "653",
//       WorkerName: 'Jacob',
//       ClientID: "313124823",
//       CarID: '95-896-78',
//       CerType:'Toyota',
//       Status: 'paid up',
//       problemDiscription: 'Throttle Actuator Control Lamp Control Circuit',
//       TotalCost:"600$"
//      }; 
//         dataBaseObject.collection("works").insertOne(work2);
//     var work3={
//       _id:'000003',
//       WorkerNumber: "653",
//       WorkerName: 'Jacob',
//       ClientID: "286532541",
//       CarID: '35-625-88',
//       CerType:'Nisan',
//       Status: 'paid up',
//       problemDiscription: 'Throttle Actuator Control Lamp Control Circuit',
//       TotalCost:"600$"
//      }
  
//      dataBaseObject.collection("works").insertOne(work3);

// //adding employees to employees collection
// dataBaseObject.collection("employees").insertOne({_id: "653", WorkerName: 'Jacob', password: "12345"  });
// dataBaseObject.collection("employees").insertOne({_id: "965", WorkerName: 'Mark', password: "12345"});
// */
// });

 

 

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
              callback(false, res,null,'login')
            }else if (result._id == workerNumIn && result.password == passwordIn){
              callback(true, res,result.WorkerName,'login')
            }
            else{
              callback(false, res,null,'login')
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
             if(user ===null){
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