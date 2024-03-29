const mongoose=require('mongoose')
const Schema=mongoose.Schema

const employeeSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    sex:{
        type:String,
        enum:['m','f'],
        required:true
    },
    department:{
        type:String,
        required:true
    },

    action:{
      type:String,
      enum:['admin','normal'],
      required:true
      
    },
    status:{
        type:Boolean
    }
})

const Employee=mongoose.model('Employee',employeeSchema);
module.exports=Employee;