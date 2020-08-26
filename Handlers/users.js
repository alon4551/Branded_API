const mongoose=require('mongoose');
const model=require('../Schemas/user');
const gender_model=require('../Schemas/gender');
const login_model=require('../Schemas/login');
const login = require('../Schemas/login');
const hash = require('password-hash');
const mailer=require('../mailer');
let ActiveUsers=[];
mongoose.connect('mongodb://localhost:27017/Branded', {useNewUrlParser: true});
const removeActive=(email)=>{
    let users=[];
    if(ActiveUsers.length!==[])
        ActiveUsers.forEach(item => {
            if(item.email!==email)
                users.push(item);
        });
        ActiveUsers=users;
}
const addActive= (email)=>{
    let check=true;
    ActiveUsers.forEach( item=> {
        if(item.email===email){
            check=false;
        }
    });
    if(check)
    getUser(email)
    .then(doc=>{
        if(doc)
            ActiveUsers.push(doc);
    })
    .catch();
}
const checkPassword=(password)=>{
    if(password===""||password===undefined)
        return false;
        return true;
}
const isUserExsist=async(user)=>{
    const {password,email}=user;
    const doc =await login.findOne({email:email});
    console.log(doc);
    if(doc===null)
        return false;
    else
        {
            if(hash.verify(password,doc.hash))    
                return true;
                else
                return false;
        }
}
const isUserVerify= async(user)=>{
    const {password,email}=user;
    const doc = await login.findOne({email:email})
    if(doc===null)
        return false;
    else{
        if(hash.verify(password,doc.hash))
            return true;
        else
            return false;
    }
}
const verifyGender= async(gender)=>{
    const doc =await gender_model.findOne({gender:gender})
    if(gender&&doc&&doc.gender===gender)
        return true;
    else
        return false;
}
const insertUser = async(user)=>{
    const {email,password,firstName,lastName,birthday,gender}=user;
    const userModel=new model({
        email:email,
        firstName:firstName,
        lastName:lastName,
        birthday:birthday,
        gender:gender
    });
    const loginModel=login_model({
        email:email,
        hash:hash.generate(password),
        verify:false
    });
    if(firstName&&lastName&&birthday&&email&&password&&gender){
        const entry= await userModel.save();
        const loger= await  loginModel.save();
        if(entry&&loger)
            return true;
        else
            return false;
    }
    else
        return false;
}
const getUser=async(email)=>{
     return await model.findOne({email:email});
}
const signOut=(req,res)=>{
    const {email}=req.body;
    removeActive(email);
    res.send(ActiveUsers);
}
const signUp=async(req,res)=>{
    const {password,gender}=req.body;
    if(checkPassword(password)===false)
            res.status(400).send("password can't be empty");
        else{
            
            if(await verifyGender(gender)){
                const answer=insertUser(req.body);
                console.log(answer);
                answer.then((doc)=>{
                        console.log(doc);    
                    if(doc){
                        mailer.Send(req.body.email);
                        res.status(200).send('user Inserted');
                        }else
                        res.status(400).send('information invalid');
                    }
                    ).catch(err=>res.status(400).send(err));
            }else
                res.status(404).send(`gender ${gender} not Found`);
            
        }
}
const signIn=async(req,res)=>{
    isUserVerify(req.body)
    .then(result=>{
        if(result){
            getUser(req.body.email)
            .then(result=>res.status(200).send(result))
            .catch(err=>res.status(500).send(err));
            addActive(req.body.email);
        }
        else
        res.status(400).send('email and password ara worng')
    })
    .catch(err=>{
        console.log(err,'fail');
        res.status(400).send('user not verifyed');
    })
}
const get=(req,res)=>{
    const {email}=req.body;
    getUser(email)
    .then(result=>res.status(200).send(result))
    .catch(err=>res.status(500).send(err));
}
const remove= async(req,res)=>{
    const {email,password}=req.body;
    const a=isUserVerify(req.body);
    isUserVerify(req.body).then(async(result)=>{
        if(result){
        const doc=await model.findOneAndDelete({email:email});
        const log = await login.findOneAndDelete({email:email});
        if(doc&&log)
            res.status(200).send('user deleted');
        else
            res.status(400).send('could not delete');
        }
        else
            res.status(404).send('password is incorrect');
    }).catch((err)=>res.status(500).send(err))
}   
const all= async(req,res)=>{
    const list=await model.find();
    if(list)
        res.status(200).send(list);
    else
        res.status(500).send('users not found');
}

const verify= async(req,res)=>{
    const {email}=req.params;
    const doc=await login_model.findOneAndUpdate({email:email},{verify:true});
    if(doc)
        res.status(200).send('Account verify please close the window');
    else
        res.status(404).send('user not found');
}
const Active=(req,res)=>{
    res.status(200).send(ActiveUsers);
}
const updateUser=async(user)=>{
    const {email,firstName,lastName,birthday,gender}=user;
    return await model.findOneAndUpdate({email:email},{
        email:email,
        firstName:firstName,
        lastName:lastName,
        birthday:birthday,
        gender:gender

    })
}
const updatePassword= async (req,res)=>{
    const {email,old_password,new_password}=req.body;
    const ver= await isUserVerify({email:email,password:old_password});
    if(ver){
        const doc = await login_model.findOneAndUpdate({email:email},{
                hash:hash.generate(new_password)
        });
        if(doc)
            res.status(200).send('updated');
        else
            res.status(400).send("problom");
    }
    else
        res.status(400).send('email and password are worng');
}
const Update =async (req,res)=>{
    const {email,password,firstName,lastName,birthday,gender}=req.body;
    if(await verifyGender(gender)){
        if(await isUserVerify({email:email,password:password})){
            const doc=updateUser(req.body);
            if(doc)
                res.status(200).send('updated');
            else
                res.status(400).send("problom");
        }
        else{
            res.status(400).send('user not found')
        }
    }
    else
        res.status(400).send(`${gender} is not found`);
}
module.exports={
    signUp,
    remove,
    get,
    signIn,
    all,
    verify,
    signOut,
    Active,
    Update,
    updatePassword
}