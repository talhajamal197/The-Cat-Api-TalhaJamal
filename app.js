const express=require("express");
const app = express();

var request = require('request');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use('/css',express.static(__dirname+'public/css'))
app.use('/js',express.static(__dirname+'public/js'))
app.set('view engine','ejs')

var obj=""
var options = {
    'method': 'GET',
    'url': 'https://api.thecatapi.com/v1/breeds?attach_breed=0',
    'headers': {
      'x-api-key': '9d2af93b-62d1-44b1-b878-167a8a7f0ac9'
    }
  };
 try {
  request(options, function (error, response) {
    if(response!=undefined){
      obj=response.body;
      
      
    }

   
  });

 }
 catch (error){
     console.log("No Internet Connection")
 }
  

app.get("/",(req,res)=>{
    if(obj!=""){
        let parsedObj=JSON.parse(obj);
        //console.log(parsedObj[0]);
        res.render('index',{obj:parsedObj})
    }
    else{
        res.send("<p>Error : 404</p>");
    }
})
app.post("/getCat",(req,res)=>{
    let a=JSON.parse(obj);
    let result = a.filter(x => x.id==req.query.catId);
   // console.log(result);
    res.render('detail',{result:result});   
})
app.post("/getCatBySearch",(req,res)=>{
  
   var val=req.body.term;
   let a=JSON.parse(obj);
   let result1 = a.filter(x => (x.name.toLowerCase())==(val.toLowerCase()));
   let result2 = a.filter(x => x.id==val);
   let result3 = a.filter(x => (x.origin.toLowerCase())==(val.toLowerCase()));
   let finalResult=[]
   if (result1.length==0 && result2.length==0 && result3.length!=0){
         finalResult=result3;
   }else if(result1.length==0 && result2.length!=0 && result3.length==0){
     finalResult=result2;
   }else if(result1.length!=0 && result2.length==0 && result3.length==0){
       finalResult=result1;
   }else if(result1.length==0 && result2.length==0 && result3.length==0){
      res.send("<p>Error : 404</p>");
   }
   console.log(finalResult.length)
   if (finalResult.length!=0){
      res.render('detail',{result:finalResult}); 
   }
   else{
    res.send("<p>Error : 404</p>");
   }
  // res.render('detail',{result:finalResult}); 
    
   
   

})
app.listen(8080, ()=>{ console.log("Listening to the server on http://localhost:8080")});