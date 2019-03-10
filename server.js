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
  employeeLogin(req.body.WorkerName,req.body.password, res);
});

/** searchEmployee
     * by: leeorr h
     * use : looking for employee on "employees" colloection(table) by empID
     *  */ 
    function searchEmployee(empIDIn){
      if( dataBaseObject.employees.find({empID : { $eq:empIDIn}})){
       console.log("user exist"); 
       return true;
      }
      else {
       console.log("user not exist"); 
       return false;
      }
     }

/** signUp
     * by: leeorr h
     * use : signUp if user not exist
     *  */ 
app.post('/signUp' , async function(req,res){
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
                callback(true, res,user,'signUp');
              //need to send somthing  
              // res.send({'success': true, 'message': 'singUp'});
             }else {
              console.log("user exist");
              db.close();
              //need to send somthing
              // res.send({'success': false, 'message': 'singUp'});
           }     
    });
  });
  
});

   /** employeeLogin
     * by: leeorr h
     * use : check empId and Password, if there is a match we'll continue
     *  */ 
    function employeeLogin(workerNameIn, passwordIn, res){
      MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dataBaseObject = db.db("projDB");
        dataBaseObject.collection('employees').findOne({WorkerName: workerNameIn},
          function(err, result) {
            if (err) throw err;
            if(result === null){
              callback(false, res,null,'login')
            }else if (result.WorkerName == workerNameIn && result.password == passwordIn){
              callback(true, res,result.WorkerName,'login')
            }
            else{
              callback(false, res,null,'login')
            }
            db.close(); 
          });
      });
    }

    function callback(bool, res,obj,message){
      var found = {'success': bool,
                   'message': message,
                   'obj': obj
                  };
      res.send(found);
    }

    /** insertNewEmployee
     * by: leeorr h
     * use : insert new employee to "employees" collection(table) by his all data
     *  */ 
    function insertNewEmployee(empIDIn,userNameIn,passwordIn,mailIn,phoneIn){
      if (!searchEmployee(empIDIn)){
      var newEmployeeData = {
                             empID:empIDIn,
                             userName:userNameIn ,//employee name
                             password:passwordIn,
                             mail:mailIn,
                             phone:phoneIn};
      //the fuction in the insertOne function is virtual/anonumys fuction
      dataBaseObject.collection("employees").insertOne(newEmployeeData,function(err,res){
        if(err) throw err;
        console.log("new employee added successfully"+newEmployeeData)
      });
    }
    else 
    console.log("user already exist"); 
    }

    /** removeEmployee
     * by: leeorr h
     * use : removing spesific employee by his empID
     *  */ 

    function removeEmployee(empIDIn){
      if(searchEmployee(empIDIn)){
        var empToDel = {empID:empIDIn};
        dataBaseObject.collection("employees").deleteOne(empToDel,function(err,obj){
          console.log(obj.result.n + " document(s) deleted"); 
        });
      }
      else 
      console.log("employee not exist"); 
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