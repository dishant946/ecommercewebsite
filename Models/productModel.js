const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    slug:{
        type:String,
        required:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        require:true,

    },
    quantity:{
        type:Number,
        require:true
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    shipping:{
        type:Boolean,
    }
},{timestamps:true});
const Product=mongoose.model("Product",productSchema);
module.exports=Product;