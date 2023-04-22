const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();
const connectDB=async ()=>{
    
        // const conn=mongoose.connect('mongodb://localhost:27017/newdb',{
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true
        //     }).then(()=>{console.log("successfully")}).catch(()=>{console.log("error")});

    try{
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb ${conn.connection.host}`);
    }   catch(err){
        console.log(err);
    } 
}
module.exports=connectDB;