var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 
var genderSchema=new Schema({
    gender:{type:String,require:true}
}) 
genderSchema.plugin(uniqueValidator);
module.exports =mongoose.model('gender',genderSchema);
