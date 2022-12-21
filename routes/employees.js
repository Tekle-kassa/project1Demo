const express=require('express');
const router=express.Router();

const Employee=require('../models/employee')
const {isLoggedIn}=require('../middleware')
const {employeeSchema}=require('../schemas')
const employees=require('../controllers/employees')
const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError');
const Joi = require('joi');

const validateEmployee=((req,res,next)=>{
   
    const {error}=employeeSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next()
  }
    
})
const sex=['m','f'];
const action=['admin','normal']

router.get('/',catchAsync(employees.index))
router.get('/new',isLoggedIn,employees.renderNewForm)

router.post('/',isLoggedIn,validateEmployee,catchAsync(employees.createEmployee))

router.get('/:id',catchAsync(employees.showEmployee))

router.get('/:id/edit',isLoggedIn,catchAsync(employees.renderEditForm))

router.put('/:id',isLoggedIn,catchAsync(employees.editEmployee))

router.delete('/:id',isLoggedIn,catchAsync(employees.removeEmployee))

module.exports=router;