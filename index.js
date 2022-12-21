const express = require('express')
const app = express();
const port =2021;
const bodyParser = require('body-parser')
const cors=require('cors')
const fileUpload = require('express-fileupload')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
const uri = `mongodb+srv://BRMC-USER:1d8jjctndl0ZDaEq@cluster0.znbhd.mongodb.net/Buds-College-Base?retryWrites=true&w=majority`;
// console.log(process.env.DB_USER)

app.use(bodyParser.json())
app.use(cors())
app.use(fileUpload())

app.get('/', (req, res) => {
    res.send('BRMC_OFFICIAL_SERVER_REPORTING_SIRRRR')
  })
  const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
  client.connect(err => {
    console.log(err)
    const TeachersCollection = client.db("Buds-College-Base").collection("Teachers");
  const AdminCollection = client.db("Buds-College-Base").collection("Admins");
  const NoticeCollection = client.db("Buds-College-Base").collection("Notices");
  const VacancyNumber = client.db("Buds-College-Base").collection("Vacancy");
  const Students = client.db("Buds-College-Base").collection("Students");

// console.log(client)
  console.log('database connect')
  
  app.post('/postteachers',(req,res)=>{
    // console.log(req.body)
    const{Name,Subject,Email,Group,Facebook}=req.body
    const{Image}=req.files
    const TeacherName=Name
    const TeacherSubject=Subject
    const TeacherEmail=Email
    const  TeacherGroup=Group
    const  FB=Facebook

    const actualImage=Image.data
const encImage=actualImage.toString('base64')
const TeacherImage={
  ContetntType:Image.mimetype,
  size:Image.size,
  img:Buffer.from(encImage,'base64')
}

      TeachersCollection.insertOne({TeacherImage,TeacherName,TeacherSubject,TeacherEmail,FB,TeacherGroup})
      .then(result=>{console.log(result.insertedCount);res.send(result.insertedCount>0)})
  })
  app.get('/getteachers',(req,res)=>{
      TeachersCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents)
          // console.log(err)
      })
      
  })

  app.patch('/updateTeacher/:id',(req,res)=>{
    // console.log(req.files)
    // console.log(req.body)
   const{Name,Email,Subject,Group}=req.body
  
  if(req.files ==null){ 
   
    
    TeachersCollection.updateOne({_id:ObjectID(req.params.id)},{
      $set:{TeacherName:Name,TeacherEmail:Email,TeacherSubject:Subject,TeacherGroup:Group}
    })
    .then(result=>{
      // console.log(result);
      res.send(result)})}
      else{
        const Image=req.files.File
  const actualImage=Image.data
  const encImage=actualImage.toString('base64')
  const TeacherImage={
    ContetntType:Image.mimetype,
    size:Image.size,
    img:Buffer.from(encImage,'base64')
  }
  
    TeachersCollection.updateOne({_id:ObjectID(req.params.id)},{
      $set:{TeacherName:Name,TeacherEmail:Email,TeacherSubject:Subject,TeacherGroup:Group,TeacherImage:TeacherImage}
    })
    .then(result=>{
      // console.log(result);
      res.send(result)})  }
    
    }
  )
  
  app.post('/postadmins',(req,res)=>{
      const adminemail=req.body
      AdminCollection.insertOne(adminemail)
    .then(result=>{console.log(result.insertedCount);res.send(result)}
    )
   
})
app.get('/getadmins',(req,res)=>{
  const email=req.query.AdminEmail
    // console.log(email)
    AdminCollection.find({AdminEmail:email})
    .toArray((err,documents)=>{
        res.send(documents)
        // console.log(documents)
    })})
    


app.post('/postnotice',(req,res)=>{
    const Notice=req.body
    NoticeCollection.insertOne(Notice)
  .then(result=>{console.log(result.insertedCount);res.send(result.insertedCount>0)}
  )})
  app.get('/getNotice',(req,res)=>{
    NoticeCollection.find({})
    .toArray((err,documents)=>{
        res.send(documents)
        // console.log(err)
    })
  })
   
   
  app.delete('/unpinAnotice/:id',(req,res)=>{
    const id=req.params.id
    // console.log(req.params.id)
      NoticeCollection.deleteOne({_id:ObjectID(id)})
    .then(result=>{
      // console.log(result)
      res.send(result.deletedCount>0)
    })
  })
  
  
// app.post('/postvacancy',(req,res)=>{
//   const vacancy=req.body
//   console.log(req.body)
//   VacancyNumber.insertOne(vacancy)
// .then(result=>{console.log(result.insertedCount);res.send(result.insertedCount>0)}
// )})
app.get('/gettvacancy',(req,res)=>{
  VacancyNumber.find({})
  .toArray((err,documents)=>{
    res.send(documents)
    console.log(documents)
})
})
app.patch('/updatevacancy/:id',(req,res)=>{
  // const updatedvacancy=req.body
  // console.log(updatedvacancy.Updated)
  const updated=req.body.Updated
  VacancyNumber.updateOne({_id:ObjectID(req.params.id)},{
    $set:{NoticeText:updated}
  })
  .then(result=>{
    // console.log(result);
    res.send(result.modifiedCount>0)})
})

app.post('/poststudent',(req,res)=>{
  const{StudentName,StudentClass,StudentRoll,StudentGroup}=req.body
  const StudentNameExact=StudentName
  const StudentClassExact=StudentClass
  const StudentRollExact=StudentRoll
  const StudentGroupExact=StudentGroup

  const {Image}=req.files
  const actualImage=Image.data
  const encImage=actualImage.toString('base64')
  const StudentImage={
    ContetntType:Image.mimetype,
    size:Image.size,
    img:Buffer.from(encImage,'base64')
  }
  Students.insertOne({Class:StudentClassExact,Group:StudentGroupExact,Roll:StudentRollExact,Name:StudentNameExact,Photo:StudentImage})
  .then(result=>{res.send(result);console.log(result.insertedCount)})
})


app.delete('/deletestudent/:id',(req,res)=>{
  Students.deleteOne({_id:ObjectID(req.params.id)})
  .then(result=>{console.log(result.deletedCount);res.send(result.deletedCount>0)})
})

app.get('/getstudents',(req,res)=>{
  Students.find({})
  .toArray((err,documents)=>{
      res.send(documents)
      // console.log(err)
  })
  
})
 

app.get('/getstudentsbyroll',(req,res)=>{
  // console.log(req.query.Roll)
  const RollNumber=req.query.Roll
  Students.find({Roll:RollNumber})
  .toArray((err,documents)=>{
      res.send(documents)
      // console.log(err)
  })
  
})
  });
  




  
app.listen(process.env.PORT||port)
