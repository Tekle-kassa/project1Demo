const Joi=require('joi')
module.exports.employeeSchema=Joi.object({
    name:Joi.string().required(),
    sex:Joi.string().required(),
    department:Joi.string().required(),
    action:Joi.string().required()
})