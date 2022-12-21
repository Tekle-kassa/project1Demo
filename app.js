const express=require('express');
const mongoose=require('mongoose');
const ejs=require('ejs');
const bodyParser=require('body-parser');
const path=require('path');
const methodOverride=require('method-override');
const session=require('express-session');
const flash=require('connect-flash')
const ejsMate=require('ejs-mate')
const passport=require('passport');
const LocalStrategy=require('passport-local')




const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')

const Employee=require('./models/employee')
const Admin=require('./models/admin');


const employees=require('./routes/employees')

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
app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')))
app.use(methodOverride('_method')) 
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session());





passport.use(new LocalStrategy(Admin.authenticate()))

passport.serializeUser(Admin.serializeUser())
passport.deserializeUser(Admin.deserializeUser())
// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
   res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})

app.use('/employees',employees)


app.get('/',(req,res)=>{
    
    // res.redirect('/employees')
    res.render('home')
    //res.redirect('/login')
})
app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async(req,res)=>{
    const {email,password,username}=req.body;
    // const hash=await bcrypt.hash(password,12)
    const trueAdmin=await Employee.findOne({name:username});
   
  if(trueAdmin && !(trueAdmin.action=='admin')){
    req.flash('error','you are not an admin')
        res.redirect('/employees')
    }else if(trueAdmin && trueAdmin.action == "admin"){
        const admin=new Admin({username,email})
        const registeredAdmin= await Admin.register(admin,password);
        req.login(registeredAdmin,err=>{
            if(err) return res.send(err)
            req.flash('success','welcome')
            res.redirect('/employees')
        })
        // req.session.user_id=admin._id
           
    }else{
      res.send("No such user")
    }
    })

app.get('/login',(req,res)=>{
    res.render('login')
})
// app.post('/login',passport.authenticate('local',{failureRedirect:'/login'}),async(req,res)=>{
//     const {username,password}=req.body;
//    const foundUser=await Admin.findAndValidate(username,password)
//     if(!foundUser){
//         res.redirect('/login')
//     }else{
//         req.session.user_id=foundUser._id
//         res.send('welcome')
//     }
 
// })
app.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back')
    res.redirect('/employees')
})
// app.post('/logout',(req,res)=>{
//     req.session.user_id=null;
//     res.redirect('/')
// })

app.get('/logout',(req,res)=>{
    req.session.passport=null;
    req.flash('success','good bye')
    res.redirect('/')
})

app.all('*',(req,res,next)=>{
    next(new ExpressError('not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message='Something went Wrong'}=err;
    res.status(statusCode).render('error',{message})
})

app.listen(3000,()=>{
    console.log('serving')
})