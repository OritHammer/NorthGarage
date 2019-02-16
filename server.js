    /********** DB Zone *************/ 
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/projectDB";
    var express =require('express');
    var app = express();
    app.use(express.json()); 
    app.use(express.urlencoded({extended: true}));
    var path=require('path');
    var router = express.Router();
    //client will not have permission to client folder only to static
    app.use('/static',express.static(path.join(__dirname,'client')));
  
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dataBaseObject = db.db("projDB");

//create collections
var server=app.listen(3000, ()=> {console.log("server in ...")});
        // adding employees collection - table
        dataBaseObject.createCollection("employees",function(err,res){
          console.log("employees collection created");
            //db.close();
        });  

        // adding 'works collection - table
        dataBaseObject.createCollection("works",function(err,res){
          console.log("works collection created!");
           // db.close();
        });    

        // adding customers collection - table
        dataBaseObject.createCollection("customers",function(err,res){
          console.log("customers collection created!");
          //  db.close();
        }); 
  /*
//adding works to works collection
    db.works.insert({
     OrderNumber: "46565465",
     WorkerNumber: "965",
     WorkerName: "Mark",
     ClientID: "313124823",
     CarID: "95-896-78",
    CerType:"Toyota",
     Status:  "Pending",
     problemDiscription: "Driver Seat Recline Position Restraints Sensor",
     TotalCost: "450$"
    });
  
    dataBaseObject.works.insert({
      'OrderNumber': '56468458',
      'WorkerNumber': 653,
      'WorkerName': 'Jacob',
      'ClientID': 313124823,
      'CarID': '95-896-78',
     'CerType':'Toyota',
      'Status': 'paid up',
      'problemDiscription': 'Throttle Actuator Control Lamp Control Circuit',
      'TotalCost$':600
     });
     dataBaseObject.works.insert({
      'OrderNumber': '56468458',
      'WorkerNumber': 653,
      'WorkerName': 'Jacob',
      'ClientID': 286532541,
      'CarID': '35-625-88',
      'CerType':'Nisan',
      'Status': 'paid up',
      'problemDiscription': 'Throttle Actuator Control Lamp Control Circuit',
      'TotalCost$':600
     });
/*
//adding employees to employees collection
dataBaseObject.works.insert({_id: 653,'WorkerName': 'Jacob', 'password': 1234})
dataBaseObject.works.insert({_id: 965,'WorkerName': 'Mark', 'password': 12345})
*/

db.close();
});

 
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

   /** employeeLogin
     * by: leeorr h
     * use : check empId and Password, if there is a match we'll continue
     *  */ 
    function employeeLogin(empIDIn,passwordIn){
      if( dataBaseObject.employees.find({empID : { $eq:empIDIn},
                                         password:{$eq:passwordIn}
                                        }))
      {
        // need to continue
      }
      else {
          alert("please make sure you insert the correct empID and password");
      }


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




