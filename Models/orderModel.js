const mongoose=require('mongoose');
const orderSchema=new mongoose.Schema({
   products:[{
    type:mongoose.ObjectId,
    ref:"Product",
   },],
   payment:{},
   buyer:{
    type:mongoose.ObjectId,
    ref:"User"
   },
   status:{
    type:String,
    default:"Not Processed",
    enum:["Not Proceseed","Processing","Shipped","Delivered","Cancel"]
   }
},{timestamps:true});

const Category=mongoose.model("Order",orderSchema);
module.exports=Category;