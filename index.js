const express=require('express');
const app=express();
const cors=require('cors');
const genderAPI=require('./Handlers/genders');
const userAPI=require('./Handlers/users');
app.use(express.json());
app.use(cors());
//------------------------------------------------s
app.get('/users',userAPI.all);
app.get('/verify/:email',userAPI.verify);
app.get('/user',userAPI.get);
app.put('/user',userAPI.Update);
app.put('/password',userAPI.updatePassword);
app.delete('/user',userAPI.remove);
app.get('/Active',userAPI.Active);
app.post('/signup',userAPI.signUp);
app.post('/signin',userAPI.signIn);
app.post('/signout',userAPI.signOut);
//-------------------------------------------------
app.post('/gender',genderAPI.insert);
app.get('/gender/:gender',genderAPI.get);
app.get('/genders',genderAPI.all);
app.put('/gender',genderAPI.update);
app.delete('/gender',genderAPI.remove);
app.listen(3000,()=>{
console.log('app is listen in port 3000');
})