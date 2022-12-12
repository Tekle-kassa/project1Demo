const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const path=require('path');
const methodOverride=require('method-override');
const session=require('express-session');



const Employee=require('./models/employee')

const app=express();
const sessionOptions={secret:'agoodsecret',resave:false,saveUninitialized:true}

mongoose.connect('mongodb://127.0.0.1:27017/pro1Demo',
{useNewUrlParser:true,
useUnifiedTopology:true})
.then(()=>{
    console.log('connected to the database')
})
.catch((e)=>{
    console.log(e);
})
// mongoose.set('strictQuery', true);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method')) 
app.use(session(sessionOptions))
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.redirect('/employees')
    //res.redirect('/login')
})
app.get('/employees',async(req,res)=>{
    const {department,sex}=req.query;
    if(department){
        const employees= await Employee.find({department});
        res.render('employees',{employees})
    }
    if(sex){
        const employees= await Employee.find({sex});
        res.render('employees',{employees})
    }else{
        const employees= await Employee.find();
        res.render('employees',{employees})
    }

    
   
})
app.get('/employees/new',(req,res)=>{
    res.render('new')
})

app.post('/employees',async(req,res)=>{
    // console.log(req.body)
    // res.send('creating the new employee')
     const employee=new Employee(req.body)
     await employee.save();
     res.redirect('/employees')
    
})

app.get('/employees/:id',async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    res.render('show',{employee})
})

app.get('/employees/:id/edit',async(req,res)=>{
    const {id}=req.params;
    const employee=await Employee.findById(id);
    res.render('edit',{employee})
})

app.put('/employees/:id',async(req,res)=>{
    const {id}=req.params;
    const employee=await Employee.findByIdAndUpdate(id,req.body)
   res.redirect(`/employees/${id}`)
})

app.delete('/employees/:id',async(req,res)=>{
    const {id}=req.params;
    await Employee.findByIdAndDelete(id);
    res.redirect('/employees')
})

app.listen(3000,()=>{
    console.log('serving')
})