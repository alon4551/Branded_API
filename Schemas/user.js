var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
 
var UserSchema=new Schema({
    email:{type:String,require:true,unique:true},
    firstName:{type:String},
    lastName:{type:String},
    birthday:{type:Date,require:true},
    gender:{type:String,ref:'gender'}
}) 

UserSchema.plugin(uniqueValidator);
module.exports =mongoose.model('users',UserSchema);
