// const mongoose=require('mongoose');
// const Schema=mongoose.Schema;
// const bcrypt=require('bcrypt')

// const adminSchema=new Schema({
// username:{
//     type:String,
//     required:true
// },
// password:{
//     type:String,
//     required:true
// }
// })
// adminSchema.statics.findAndValidate=async function(username,password){
//   const foundUser= await this.findOne({username})
  
//   const isValid=await bcrypt.compare(password,foundUser.password)
//   return isValid ? foundUser : false
// } 
// adminSchema.pre('save',async function(next){
//     if(!this.isModified('password')) return next()
//     this.password=await bcrypt.hash(this.password,12);
//     next();
// })

// const Admin=mongoose.model('Admin',adminSchema);
// module.exports=Admin;

const mongoose=require('mongoose');
const Schema=mongoose.Schema
const passportLocalMongoose=require('passport-local-mongoose');
const AdminSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})
AdminSchema.plugin(passportLocalMongoose)
module.exports=mongoose.model('Admin',AdminSchema);