const express=require('express');
const app=express();
const dotenv=require('dotenv');
const cors=require('cors');
const registerRoute=require('./Routes/routes.js');
const loginRoute=require('./Routes/routes.js');
const categoryRoute=require('./Routes/categoryRoute.js');
const productRoute=require('./Routes/productRoute.js');
const path=require('path');
dotenv.config();
const connectDB =require('./db.js');
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'./client/build')));
app.use('/',registerRoute);
app.use('/',loginRoute);
app.use('/',categoryRoute);
app.use('/',productRoute);




app.get('/',(req,res)=>{
    res.send("<h1>Hello this is ecommerce app</h1>");
})
app.use('*',function(req,res){
res.sendFile(path.join(__dirname,"./client/build/index.html"));
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Running at ${PORT}`);
})