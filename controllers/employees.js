const Employee=require('../models/employee')

module.exports.index= async(req,res)=>{
    const {department,sex}=req.query;
    if(department){
        const employees= await Employee.find({department});
        return res.render('employees',{employees})
    }
    if(sex){
        const employees= await Employee.find({sex});
       return res.render('employees',{employees})
    }else{
        const employees= await Employee.find();
        res.render('employees',{employees})
    }

}

module.exports.renderNewForm=(req,res)=>{
    res.render('new',{sex,action})
}

module.exports.createEmployee=async(req,res,next)=>{
    // if(!req.body)throw new ExpressError('invalid data',400)
    const employee=new Employee(req.body)
    await employee.save();
    req.flash('success','successfully registered an employee')
    res.redirect('/employees')
   
}
module.exports.showEmployee=async(req,res)=>{
    const employee=await Employee.findById(req.params.id);
    if(!employee){
        req.flash('error','there is no such employee')
       return res.redirect('/employees')
    }
    res.render('show',{employee})
}
module.exports.renderEditForm=async(req,res)=>{
    const {id}=req.params;
    const employee=await Employee.findById(id);
    if(!employee){
        req.flash('error','there is no such employee')
       return res.redirect('/employees')
    }
    res.render('edit',{employee,sex,action})
}
module.exports.editEmployee=async(req,res)=>{
    const {id}=req.params;
    const employee=await Employee.findByIdAndUpdate(id,req.body);
    console.log(employee)
    req.flash('success','successfully updated the employee info')
   res.redirect(`/employees/${id}`)
}
module.exports.removeEmployee=async(req,res)=>{
    const {id}=req.params;
    await Employee.findByIdAndDelete(id);
    req.flash('success','successfully removed an emplooyee ')
    res.redirect('/employees')
}