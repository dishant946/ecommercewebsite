const usermodel=require("../Models/user.js");
const bcryptjs=require('bcryptjs');
const JWT=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const registerController=async (req,res)=>{
 try{
    const {name,email,password,phone,address,answer}=req.body;
    if(!name|| !email || !password || !phone || !address || !answer){
    return res.json({
            success:false,
            message:"all field are required"
        });
    }
    const userExist=await usermodel.findOne({email:email});
    if(userExist){
        return res.json({
          success:false,
            message:"user already exists"
        });
    }
    const salt=await bcryptjs.genSalt(10);
    const haspassowrd=await bcryptjs.hash(password,salt);

    const data=new usermodel({name,email,password:haspassowrd,phone,address,answer});
    const response =await data.save();
    if(response){
        res.status(201).send({
            message:"user registered successfully",
            success:true,
            response
        });
    }
    else{
        return res.json({
          success:false,
            message:"not registered"
        })
    }

 }catch(error){
    return res.send({
        message:"error in register controller",
        success:false,
        error
    })
 }
}
const loginController=async (req,res)=>{
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
          return res.status(200).send({
            success: false,
            message: "Invalid email or password",
          });
        }
        //check user
        const user = await usermodel.findOne({ email });
        if (!user) {
           res.status(200).send({
            success: false,
            message: "Email is not registerd",
          });
        }
        const match = await bcryptjs.compare(password, user.password);
        if (!match) {
          return res.status(200).send({
            success: false,
            message: "Invalid Password",
          });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({
          success: true,
          message: "login successfully",
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            adddress: user.address,
            role:user.role
          },
          token,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error in login",
          error,
        });
      }

}

const forgotpasswordController=async(req,res)=>{
  try{
      const {email,answer,newpassword}=req.body;
      if(!email){
        res.status(400).send({message:"Email is required"});
      }
      if(!answer){
        res.status(400).send({message:"answer is required"});
      }
      if(!newpassword){
        res.status(400).send({message:"New password is required"});
      }
const user=await usermodel.findOne({email,answer});
if(!user){
   res.status(404).send({
    success:false,
    message:"Wrong email or answer"
  });
}
const salt=await bcryptjs.genSalt(10);
const hashed=await bcryptjs.hash(newpassword,salt);
await usermodel.findByIdAndUpdate(user._id,{password:hashed});
res.status(200).send({
  success:true,
  message:"password reset successfully"
})
  }catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:"Something went wrong",
      err
    })
  }
}
const testController=(req,res)=>{
    res.send({message:"protected routes"});
}

const updateProfileController=async(req,res)=>{
  try{
      const {name,email,address,phone}=req.body;
      const user=await usermodel.findById(req.user._id); 
        const updateUser=await usermodel.findByIdAndUpdate(req.user._id,{
          name:name|| user.name,
          phone:phone||user.phone,
          address:address||user.address
        },{new:true})
      res.status(200).send({
        success:true,
        message:"profile upadted successfully",
        updateUser
      })
    
  }catch(err){
    console.log(err);
    res.status(500).send({
      success:false,
      message:"Error while upadating profile",
      err
    })
  }
}
module.exports={registerController,loginController,testController,forgotpasswordController,updateProfileController};