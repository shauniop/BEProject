
var express = require('express');
var app = express();
var router = express.Router();
var path = __dirname;
app.use('/',router);
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
const multer = require('multer');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// Required files
var mongo = require('./modules/db.js');
var page1 = require('./modules/syllabusModulesVP.js');
var page2 = require('./modules/COAttain.js');
var page3 = require('./modules/COAttainToolVP.js');
var page4 = require('./modules/CourseOutcome.js');
var page5 = require('./modules/Course.js');


// Start listening 
var port_number = app.listen(process.env.PORT || 7000);
app.listen(port_number,function(){
  console.log('Server running at Port 7000');
});



router.get('/',function(req,res){
  res.render('index');
});

router.get('/syllabus',function(req,res){
  res.render('syllabus');
});

router.get('/plans',function(req,res){
  res.render('plans');
});

router.get('/course',function(req,res){
  res.render('course');
});



//create folder uploads if it does not exist......if it exists, it does nothing
    var mkdirp = require('mkdirp');  console.log(__dirname);
    mkdirp.sync(__dirname+'/uploads', function (err) {
        if (err) console.error(err)
        else console.log('Uploads folder created!')
    });
    
    mkdirp.sync(__dirname+'/reports', function (err) {
        if (err) console.error(err)
        else console.log('Reports folder created!')
    });


// Syllabus Modules---------------------------------------------------
app.use('/syllabusModulesVP', page1.syllabusModulesVP);   

router.get('/syllabusModules',function(req,res){
  mongo.connect(function( err ) {
      if(err) throw err;
      mongo.dbo.collection('SyllabusModules').find().toArray(function(err , rows){
        if (err) return console.log(err)
        res.render('moduleData', {obj:rows});
              console.log("Module doc read");
        });
    });
});



// Syllabus Examination Scheme-----------------------------------------------
app.post('/virtualPage2',function(req,res){
  console.log(req.body);

  var myobj={};
   myobj['courseID'] = req.body.courseID;
   myobj['courseName'] = req.body.courseName;
   myobj['iatest1'] = parseInt(req.body.iatest1);
   myobj['iatest2'] = parseInt(req.body.iatest2);
   myobj['iatestavg'] = parseInt(req.body.iatestavg);
   myobj['endsem'] = parseInt(req.body.endsem);
   myobj['duration'] = parseInt(req.body.duration);
   myobj['tw'] = parseInt(req.body.tw);
   myobj['oral'] = parseInt(req.body.or);
   myobj['total'] = parseInt(req.body.total);
   
   dbo.collection('Course').find({"courseID" : req.body.courseID}).toArray(function(err , rows){
                  dbo.collection('Course').updateOne(
                      { courseID:myobj['courseID'] },
                      {
                          $set: { 
                                    courseName : myobj['courseName'],
                                    InternalAssessmentTest_1 : myobj['iatest1'],
                                    InternalAssessmentTest_2 : myobj['iatest2'],
                                    InternalAssessmentTest_Avg : myobj['iatestavg'],
                                    EndSemesterExam : myobj['endsem'],
                                    duration : myobj['duration'],
                                    termWork : myobj['tw'],
                                    oral : myobj['oral'],
                                    total : myobj['total']
                                }
                      },
                      { upsert : true }
                      );

      });

 
  res.redirect('/syllabusScheme');  //using POST REDIRECT GET

});



router.get('/syllabusScheme',function(req,res){
  dbo.collection('SyllabusScheme').find().toArray(function(err , rows){
  if (err) return console.log(err)
  res.render('schemeData', {obj:rows});
        console.log("Scheme doc read");
    });
});





// Lecture Schedule--------------------------------------------------------

app.post('/virtualPage3',function(req,res){
console.log(req.body);
  var yourobj={};
   yourobj['num'] = req.body.num;
   yourobj['portion'] = req.body.portion;
   yourobj['planned'] = req.body.planned;
   yourobj['actual'] = req.body.actual;
   yourobj['method'] = req.body.method;
   

   console.log('num',yourobj['num']);
   console.log('portion',yourobj['portion']);
   console.log('planned',yourobj['planned']);
   console.log('actual',yourobj['actual']);
   console.log('method',yourobj['method']);

   
   dbo.collection("Lecture").insertOne(yourobj, function(err, res) {
      if (err) throw err;
      console.log("1 Lecture doc inserted");

  });

  res.redirect('/lecture'); //using POST REDIRECT GET

});


router.get('/lecture',function(req,res){
    dbo.collection('Lecture').find().toArray(function(err , rows){
  if (err) return console.log(err)
  res.render('lecture', {obj:rows});
        console.log("Lecture doc read");
    });
 });



// Lab ---------------------------------------------------------------

app.post('/virtualPage4',function(req,res){
  console.log(req.body);
  var yourobj={};
   yourobj['expnum'] = req.body.expnum;
   yourobj['dateA'] = req.body.dateA;
   yourobj['dateB'] = req.body.dateB;
   yourobj['dateC'] = req.body.dateC;
   yourobj['dateD'] = req.body.dateD;
   yourobj['concept'] = req.body.concept;
   yourobj['titleaim'] = req.body.titleaim;
   

   console.log('expnum',yourobj['expnum']);
   console.log('dateA',yourobj['dateA']);
   console.log('dateB',yourobj['dateB']);
   console.log('dateC',yourobj['dateC']);
   console.log('dateD',yourobj['dateD']);
   console.log('concept',yourobj['concept']);
   console.log('titleaim',yourobj['titleaim']);

   
   dbo.collection("Lab").insertOne(yourobj, function(err, res) {
      if (err) throw err;
      console.log("1 Lab doc inserted");

  });

  res.redirect('/lab'); //using POST REDIRECT GET

});


router.get('/lab',function(req,res){
    dbo.collection('Lab').find().toArray(function(err , rows){
  if (err) return console.log(err)
  res.render('lab', {obj:rows});
        console.log("Lab doc read");
    });
 });




// Assignments---------------------------------------------------------------

app.post('/virtualPage5',function(req,res){
  console.log(req.body);

      var myobj={};
   myobj['question'] = req.body.question;
   myobj['givenDate'] = req.body.givenDate;
   myobj['subDate'] = req.body.subDate;
   dbo.collection("Assignments").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 MP doc inserted");

  });

  res.redirect('/ass'); //using POST REDIRECT GET

});


router.get('/ass',function(req,res){






var mongo = require('mongodb').MongoClient;
    var assert = require('assert');
    var resultArray = [];

   // mongo.connect(url, function(err, db) {
    //assert.equal(null, err);
    var cursor = dbo.collection('Assignments').find();

         var PDFDocument = require('pdfkit');
          var fs = require('fs');

      var pdfdoc = new PDFDocument;    
      console.log(" new pdf doc variable");

      //var pdfFile = path.join('reports/', 'out.pdf');
      //var pdfStream = fs.createWriteStream('reports/out.pdf');


      pdfdoc.pipe(fs.createWriteStream('reports/assignment.pdf'));    
      //console.log(" report generation");
      //doc.font('fonts/PalatinoBold.ttf').fontSize(25).text(100, 100);


      cursor.forEach(function(doc, err) {
      console.log(" isnde foreach");
        
      assert.equal(null, err);
      resultArray.push(doc);

        console.log("this s tj e doocccc",doc);
         
        // doc.font('Times-Roman')
        //     .fontSize(48)
        //     .text(resultArray,100,100);

        //doc.text(resultArray,100,100);
        console.log("this is result Array = ",resultArray);
        console.log(" report text added");

//doc.end();


    }, function() {
      //dbo.close();
      //res.render('/mp');
console.log(" inside the second function  = ",resultArray);



pdfdoc.text('FR. Conceicao Rodrigues College Of Engineering', 145,20);
pdfdoc.moveDown();
pdfdoc.text('Father Agnel Ashram, Bandstand, Bandra-west, Mumbai-50', 125,32);
pdfdoc.moveDown();
pdfdoc.text('Department of Computer Engineering', 155,44);



for(var i = 0, len = resultArray.length; i < len; i++){
pdfdoc.text(i+1,90,100+(i*75));
pdfdoc.text(resultArray[i].question,100,100+(i*75));
pdfdoc.text('Date of Assignment given:',100,135+(i*75));
pdfdoc.text(resultArray[i].givenDate,300,135+(i*75));
pdfdoc.text('Date of Assignment submission:',100,150+(i*75));
pdfdoc.text(resultArray[i].subDate,300,150+(i*75));
pdfdoc.moveDown();
}
      

dbo.collection('Assignments').find().toArray(function(err , rows){
  if (err) return console.log(err)
  res.render('assData', {obj:rows});
        console.log("Ass doc read");
    });





//pdfdoc.pipe(fs.createWriteStream('reports/output.pdf'));   
console.log('fs createWriteStream');
//pdfdoc.text("any crap", 100,100); 


// pdfStream.addListener('finish', function() {
//     // HERE PDF FILE IS DONE

//       console.log(" pdfStream ");
//     res.download('reports/out.pdf');
//  });
//pdfdoc.text(resultArray['0'],100,100);
pdfdoc.end();

    });


    
});



// Lab---------------------------------------------------------------

app.post('/virtualPage11',function(req,res){
  console.log(req.body);
  /*var query = "INSERT INTO assignment(question,subDate,givenDate) VALUES(";
 query+= " '"+req.body.question+"',";
 query+= " '"+req.body.givenDate+"',";
 query+= " '"+req.body.subDate+"')";

 connection.query(query, function(err,rows,fields){
    if(!!err){
  console.log('Error in the assignm insert query');
     }else{
  console.log('Successful assignm insert query');
      }*/

     
});






// Mini Project---------------------------------------------------------------

app.post('/virtualPage6',function(req,res){
  console.log(req.body);

   var myobj={};
   myobj['mpDate'] = req.body.mpDate;
   myobj['activity'] = req.body.activity;
   dbo.collection("MiniProject").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 MP doc inserted");
   });
 
  res.redirect('/mp');  //using POST REDIRECT GET
console.log(" report 1");

///// report generation

//   var PDFDocument = require('pdfkit');
//   var fs = require('fs');

// doc = new PDFDocument;    
// console.log(" report 2");

// doc.pipe(fs.createWriteStream('reports/output.pdf'));    
// console.log(" report generation");
// //doc.font('fonts/PalatinoBold.ttf').fontSize(25).text(100, 100);

// doc.font('Times-Roman')
//     .fontSize(48)
//     .text(myobj['mpDate'],100,100);

// console.log(" report text added");

// doc.end();

///// end report generation
});

router.get('/mp',function(req,res){

    
    var mongo = require('mongodb').MongoClient;
    var assert = require('assert');
    var resultArray = [];

   // mongo.connect(url, function(err, db) {
    //assert.equal(null, err);
    var cursor = dbo.collection('MiniProject').find();

         var PDFDocument = require('pdfkit');
          var fs = require('fs');

      var pdfdoc = new PDFDocument;    
      console.log(" new pdf doc variable");

      //var pdfFile = path.join('reports/', 'out.pdf');
      //var pdfStream = fs.createWriteStream('reports/out.pdf');


      pdfdoc.pipe(fs.createWriteStream('reports/output.pdf'));    
      //console.log(" report generation");
      //doc.font('fonts/PalatinoBold.ttf').fontSize(25).text(100, 100);


      cursor.forEach(function(doc, err) {
      console.log(" isnde foreach");
        
      assert.equal(null, err);
      resultArray.push(doc);

        console.log("this s tj e doocccc",doc);
         
        // doc.font('Times-Roman')
        //     .fontSize(48)
        //     .text(resultArray,100,100);

        //doc.text(resultArray,100,100);
        console.log("this is result Array = ",resultArray);
        console.log(" report text added");

//doc.end();


    }, function() {
      //dbo.close();
      //res.render('/mp');
console.log(" inside the second function  = ",resultArray);



pdfdoc.text('FR. Conceicao Rodrigues College Of Engineering', 145,20);
pdfdoc.moveDown();
pdfdoc.text('Father Agnel Ashram, Bandstand, Bandra-west, Mumbai-50', 125,32);
pdfdoc.moveDown();
pdfdoc.text('Department of Computer Engineering', 155,44);


pdfdoc.text('Date',100,85);
pdfdoc.text('Activity',225,85);


for(var i = 0, len = resultArray.length; i < len; i++){
pdfdoc.text(resultArray[i].mpDate,100,100+(i*50));
pdfdoc.text(resultArray[i].activity,225,100+(i*50));

pdfdoc.moveDown();
}
      dbo.collection('MiniProject').find().toArray(function(err , rows){
  if (err) return console.log(err)
    // console.log(rows[0].mpDate);
  res.render('mpData', {obj:rows});
        console.log("MP doc read");
    });





//pdfdoc.pipe(fs.createWriteStream('reports/output.pdf'));   
console.log('fs createWriteStream');
//pdfdoc.text("any crap", 100,100); 


// pdfStream.addListener('finish', function() {
//     // HERE PDF FILE IS DONE

//       console.log(" pdfStream ");
//     res.download('reports/out.pdf');
//  });
//pdfdoc.text(resultArray['0'],100,100);
pdfdoc.end();

    });

      

      

//console.log(" result outside the  = ",resultArray);
//console.log("test to see flow final");
// pdfdoc.pipe(fs.createWriteStream('reports/output.pdf'));   
// console.log('fs createWriteStream'); 
// pdfdoc.text(resultArray,100,100);
 // });


});





// CO Attainment Adding tools---------------------------------------------------------------

app.use('/COAttainToolVP', page3.COAttainToolVP);


  



// PO table---------------------------------------------------------------
app.post('/virtualPage10',function(req,res){
  console.log(req.body);

console.log("1 po doc");
  var myobj={};
   myobj['poID'] = req.body.poID;
   myobj['textpo'] = req.body.textpo;
   dbo.collection('POAttainment').insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 po doc inserted");
   });
 
  res.redirect('/poattainment');  //using POST REDIRECT GET
});





// End of PO table---------------------------------------------------------------

// PO Attainment---------------------------------------------------------------
var overallAttainPO;
app.post('/virtualPage8',function(req,res){
  console.log(req.body);

  var myobj={};
  myobj['courseID'] = req.body.courseID;
   myobj['po1'] = req.body.po1;
   myobj['po2'] = req.body.po2;
    myobj['po3'] = req.body.po3;
   myobj['po4'] = req.body.po4;
    myobj['po5'] = req.body.po5;
   myobj['po6'] = req.body.po6;
    myobj['po7'] = req.body.po7;
   myobj['po8'] = req.body.po8;
    myobj['po9'] = req.body.po9;
   myobj['po10'] = req.body.po10;
    myobj['po11'] = req.body.po11;
   myobj['po12'] = req.body.po12;



    console.log(myobj['po12']);
//// coonditions for 0
if (myobj['po1'] == '' )
{
  myobj['po1'] = 0;
}
if (myobj['po2'] == '' )
{
  myobj['po2'] = 0;
}
if (myobj['po3'] == '' )
{
  myobj['po3'] = 0;
}
if (myobj['po4'] == '' )
{
  myobj['po4'] = 0;
}
if (myobj['po5'] == '' )
{
  myobj['po5'] = 0;
}
if (myobj['po6'] == '' )
{
  myobj['po6'] = 0;
}
if (myobj['po7'] == '' )
{
  myobj['po7'] = 0;
}
if (myobj['po8'] == '' )
{
  myobj['po8'] = 0;
}
if (myobj['po9'] == '' )
{
  myobj['po9'] = 0;
}
if (myobj['po10'] == '' )
{
  myobj['po10'] = 0;
}
if (myobj['po11'] == '' )
{
  myobj['po11'] = 0;
}
if (myobj['po12'] == '' )
{
  myobj['po12'] = 0;
}



/// insertion in the PO Table --- we hav to remove this block

 // myobj['poID'] = req.body.poID;
 //   myobj['text'] = req.body.text;
 //   dbo.collection('POAttainment').insertOne(myobj, function(err, res) {
 //      if (err) throw err;
 //      console.log("1  PO Value doc inserted");
 //   });

///// End of INsertions

//// end of conditions
   myobj['test'] = parseFloat(myobj['po12']) + parseFloat(myobj['po1']);


 myobj['total'] = parseFloat(myobj['po1']) + parseFloat(myobj['po2']) + parseFloat(myobj['po3']) + parseFloat(myobj['po4']) + parseFloat(myobj['po5']) + parseFloat(myobj['po6']) + parseFloat(myobj['po7']) + parseFloat(myobj['po8']) + parseFloat(myobj['po9']) + parseFloat(myobj['po10']) + parseFloat(myobj['po11']) + parseFloat(myobj['po12']);


/// putting in co table
 dbo.collection('CourseOutcome').find({"courseID" : req.body.courseID}).toArray(function(err , rows){
                  dbo.collection('CourseOutcome').updateOne(
                      { courseID:myobj['courseID'] },
                      {
                          

                          $push: { 
                                    "pos" : {
                                                po1 : myobj['po1'],
                                                po2 : myobj['po2'],
                                                po3 : myobj['po3'],
                                                po4 : myobj['po4'],
                                                po5 : myobj['po5'],
                                                po6 : myobj['po6'],
                                                po7 : myobj['po7'],
                                                po8 : myobj['po8'],
                                                po9 : myobj['po9'],
                                                po10 : myobj['po10'],
                                                po11: myobj['po11'],
                                                po12 : myobj['po12']



                                             }
                                }
                      },
                      { upsert : true }
                      );

               });

// this is the faulty part
// dbo.collection('CourseOutcome').find( { "pos": { po1:0, courseID: "CSC302.1" } } ).toArray(function(err , rows){
// console.log(rows);
// });


//////testing overall attain


///gives the output as snapshot wala
/*dbo.collection('CourseOutcome').find({ courseID:myobj['courseID']},{overallAttain : 1, _id : 0,courseName : 0,courseID :0 }).toArray(function(err , rows){
overallAttainPO = rows['0'].overallAttain;
console.log(rows['0'].overallAttain);
console.log(typeof(rows));

console.log(overallAttainPO);
 });
*/
/*function getOverallAttain() {
dbo.collection('CourseOutcome').find({ courseID:myobj['courseID']},{overallAttain : 1, _id : 0,courseName : 0,courseID :0 }).toArray(function(err , rows){
overallAttainPO = rows['0'].overallAttain;
//return rows['0'].overallAttain;
console.log(rows['0'].overallAttain);
console.log(typeof(rows));

console.log('overall shhitt',overallAttainPO);
 //return overallAttainPO;
 });
// return 'did not work';
console.log('overall shhitt 11111',overallAttainPO);
} 

var x1 = getOverallAttain();
console.log('the outside function',x1);*/
//console.log(typeof(dbo.collection('CourseOutcome').find({ courseID:myobj['courseID']},{overallAttain : 1})));




///gives output
/*dbo.collection('POAttainment').aggregate([
   {
     $lookup:
       {
         from: "CourseOutcome",
         localField: myobj['courseID'],
         foreignField: "overallAttain" ,
         as: "docs"
       }
  }
]).toArray(function(err , rows){
console.log(rows);
 });*/





/////////////////test block it is running 

//var arr1 = new Array();
dbo.collection('CourseOutcome').find({ courseID:myobj['courseID']},{overallAttain : 1, _id : 0,courseName : 0,courseID :0 }).toArray(function(err , rows){
overallAttainPO = rows['0'].overallAttain;
//return rows['0'].overallAttain;
console.log(rows['0'].overallAttain);
console.log(typeof(rows));

console.log('overall shhitt',overallAttainPO);
 //return overallAttainPO;
 
if(myobj['po1'] > 0 && myobj['po1'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '1' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po1'],
                                                    overallAttain : overallAttainPO
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
//var total = 0,count=0;

////////////////total,count,co-po

dbo.collection('POAttainment').find({poID : '1'},{"try1.insidetry2.value" : 1}).toArray(function(err , rows){
console.log('INside the if of PO1',rows['0'].try1['0'].insidetry2.value);
console.log('before total');
var total = 0,count=0;
console.log('before for');
console.log(rows['0'].try1.length);
for (var i = 0, len = rows['0'].try1.length; i < len; i++) {

   total = total + parseFloat(rows['0'].try1[i].insidetry2.value);

   ///console.log('this is total',total);
   console.log('this is total',total);
   //console.log('this is total',total);
   count++;
   //console.log('this is counttt',count);
   console.log('this is counttt',count);
   //console.log('this is counttt',count);
}

console.log('this is total',total);
console.log('this is counttt',count);

var copomatrix = total / count;


//////////////////////////po atttainment

/*dbo.collection('POAttainment').find( {$and : [{poID : '1'}, { try1: { $elemMatch : { insidetry2: { $elemMatch: {value : '1'}}}}}]}).toArray(function(eerr , rows){
  console.log('match',rows);
});*/ 

dbo.collection('POAttainment').find( 
  {
    $and : [
            {poID : '1'}
            ]
  }).toArray(function(eerr , rows1){
 // console.log('match',rows1);
  //console.log('inside match',rows1['0'].try1['0'].courseID);
  var sum1=0,count1=0,sum2=0,count2=0,sum3=0,count3=0;
  var flag1=0,flag2=0,flag3=0;
for(var i = 0, len = rows['0'].try1.length; i < len; i++){
  if(rows1['0'].try1[i].insidetry2.value == '1')
  {
    console.log('inside valueee onneee');
    sum1 = sum1 + rows1['0'].try1[i].insidetry2.overallAttain;
    count1++;
    console.log('checckkkkk1',rows1['0'].try1[i].insidetry2.overallAttain);
    flag1=1;
  }




   if(rows1['0'].try1[i].insidetry2.value == '2')
  {
    console.log('inside valueee twoo');
    sum2 = sum2 + rows1['0'].try1[i].insidetry2.overallAttain;
    count2++;

    console.log('checckkkkk2',rows1['0'].try1[i].insidetry2.overallAttain);
    flag2=2;
  }


   if(rows1['0'].try1[i].insidetry2.value == '3')
  {
    console.log('inside valueee threeeeeeee');
    sum3 = sum3 + rows1['0'].try1[i].insidetry2.overallAttain;
    count3++;
    console.log('checckkkkk3',rows1['0'].try1[i].insidetry2.overallAttain);
    flag3=3;
  }


}
var average1=0,valavg1=0,average2=0,valavg2=0,average3=0,valavg3=0;
if(flag1==1){
  console.log('inside flag onne');
average1 = sum1/count1;
valavg1 = 1 * average1;
console.log('value 1',valavg1);
}
if(flag2==2){
  console.log('inside flag twoo');
 average2 = sum2/count2;
 valavg2 = 2 * average2;
console.log('value 2',valavg2);

}
if(flag3==3){
  console.log('inside flag three');
average3 = sum3/count3;
valavg3 = 3 * average3;
console.log('value 3',valavg3);
}
var totalvalavg = valavg1+valavg2+valavg3;
console.log('totaalvalavgg',totalvalavg);
var poattain = totalvalavg/(flag1+flag2+flag3);
console.log('final yyaayy',poattain);





/*dbo.collection('POAttainment').find({poID : '1'},{"try1.insidetry2.value" : 1, "try1.insidetry2.overallAttain" : 1}).toArray(function(err , rows){
//console.log('INside the if of PO1',rows['0'].try1['0'].insidetry2.value);
//console.log('before total');

console.log('before for po Attainment');

console.log(rows['0'].try1.length);
for (var i = 0, len = rows['0'].try1.length; i < len; i++) {


   



   /*total = total + parseFloat(rows['0'].try1[i].insidetry2.value);
   //console.log('this is total',total);
   count++;
   //console.log('this is counttt',count);*/
//}









///////////////inserting total,count,copo and poattain in database


dbo.collection('POAttainment').updateOne(
                      { poID : '1' },
                      {              $set: { 
                                              "total" : total,
                                              "count" : count,
                                              "CoPoMatrix" : copomatrix,
                                              "Poattainment" : poattain
                                }
                      },
                      { upsert : true }
                      );







console.log('this is total',total);
console.log('this is counttt',count);
console.log('after for');
});
 });
//console.log('INside the if of PO1',arr1);

//console.log('this is counttt check',count);
///counting
/*dbo.collection('POAttainment').find({poID : '1'},{"try1.insidetry2.value" : 1}).toArray(function(err , rows){

 console.log('count',rows['0'].try1['1'].insidetry2.value);
 

 });*/



}



if(myobj['po2'] > 0 && myobj['po2'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '2' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po2']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po3'] > 0 && myobj['po3'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '3' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po3']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po4'] > 0 && myobj['po4'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '4' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po4']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po5'] > 0 && myobj['po5'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '5' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po5']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po6'] > 0 && myobj['po6'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '6' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po6']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po7'] > 0 && myobj['po7'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '7' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po7']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po8'] > 0 && myobj['po8'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '8' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po8']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po9'] > 0 && myobj['po9'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '9' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po9']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po10'] > 0 && myobj['po10'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '10' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po10']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po11'] > 0 && myobj['po11'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '11' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po11']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
if(myobj['po12'] > 0 && myobj['po12'] <= 3){
dbo.collection('POAttainment').updateOne(
                      { poID : '12' },
                      {              $push: { 
                                    "try1" : {
                                                courseID : req.body.courseID,
                                                  "insidetry2":{
                                                    value : myobj['po12']
                                                  }
                                             }
                                }
                      },
                      { upsert : true }
                      );
}
});



  res.redirect('/poattainment');  //using POST REDIRECT GET
});




router.get('/poattainment',function(req,res){
   
   dbo.collection('CourseOutcome').find().toArray(function(err , COrows){
        if (err) return console.log(err)
         res.render('poattainment', {obj1:COrows});

        console.log("poattainment doc read");
    });
});




// Course --------------------------------------------------------------

app.use('/Course', page5.Course);




// coattain------------------------------------

app.use('/coattain', page2.COAttain);



// Course Outcome--------------------------------------------------------------

app.use('/CourseOutcome', page4.CourseOutcome);


