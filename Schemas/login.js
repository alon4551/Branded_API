var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 
var loginSchema=new Schema({
    email:{type:String,ref:'users'},
    hash:{type:String,require:true},
    verify:{type:Boolean,require:true}
}) 

loginSchema.plugin(uniqueValidator);
module.exports =mongoose.model('login',loginSchema);
