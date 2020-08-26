const mongoose=require('mongoose');
const model=require('../Schemas/gender');
mongoose.connect('mongodb://localhost:27017/Branded', {useNewUrlParser: true});
const insert=async (req,res)=>{
    const {gender}=req.body;
    const myModel=new model({
        gender:gender
    });
    myModel.save((err)=>{
        if(err) res.status(400).send(err);
        else res.status(200).send('gender inserted to the world');
    });
    
}
const all=async(req,res)=>{
    const list=await model.find();
    if(list)
        res.status(200).send(list);
    else
        res.status(500).send('users not found');
}
const get=(req,res)=>{
    const {gender}=req.params;
    model.findOne({gender:gender})
    .exec()
    .then(doc=>{
        console.log(doc);
        if(doc)
        res.send(doc);
        else
        res.status(404).send({message:`gender ${gender} not found`})
    })
    .catch(err=>{
        console.log(err);    
        res.status(500).send(JSON.stringify({error:err}))
    });
}
const update=(req,res)=>{
    const {_id,gender}=req.body;
    const myModel=new model({_id:_id,gender:gender},{_id:_id});
    myModel.update(myModel).
    exec()
    .then(res=>{   console.log(res);
        if(res.n!==0)
            res.status(200).send(`${gender} was updated`);
        else
            res.status(404).send(`${gender} wasn't able to updated`);
    })
    .catch(err=>{
        console.log(err)
        ;res.status(500).send(err)
    });
}
const remove=(req,res)=>{
    const {gender}=req.body;
    model.deleteOne({gender:gender},(err)=>{
        if(err){
            console.log(err);
            res.status(500).send(err)
        }
        else{
            res.status(200).send(`${gender} removed`);
        }
    })
}
module.exports={
    insert,
    get,
    all,
    update,
    remove
}