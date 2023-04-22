const slugify=require('slugify');
const categorymodel=require('../Models/categoryModel.js');
const createCategoryController=async(req,res)=>{
try{
    const {name}=req.body;
    if(!name){
        return res.status(401).send({
            message:"Name is required"
        });

    }
    const existingCategory=await categorymodel.findOne({name});
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"Category already exists"
        })
    }
    const category=await new categorymodel({name,slug:slugify(name)}).save();
    res.status(201).send({
        success:true,
        message:"New Category created",
        category
    })
}
catch(err){
    console.log(err);
    res.status(500).send({
        success:false,
        err,
        message:"Error in Category"
    })
}
}

const updatecategoryController=async(req,res)=>{
    try{
        const {name}=req.body;
        const {id}=req.params;
        const category=await categorymodel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});
        res.status(200).send({
            success:true,
            message:"Category Updated",
            category
        })
    }catch(er){
        console.log(er);
        res.status(500).send({
            success:false,
            er,
            message:"Error in update category"
        })
    }
}
const categorysController=async(req,res)=>{
    try{
        const category=await categorymodel.find({});
        res.status(200).send({
            success:true,
            message:"All Category List",
            category
        })
    }
    catch(err){
        console.log(err);
        res.status(500).send({
            success:false,
            message:"Error in categorys ",
            err
        })
    }
}
const singlecategoryController=async(req,res)=>{
try{
    const {slug}=req.params;
    const category=await categorymodel.findOne({slug});
    res.status(200).send({
        success:true,
        message:"get the single category",
        category
    })
}
catch(err){
    console.log(err);
    res.status(500).send({
        success:false,
        message:"Error in single category",
        err
    })
}
}
const deletecategoryController=async(req,res)=>{
    try{
        const {id}=req.params;
       const category=await categorymodel.findByIdAndDelete(id);
       res.status(200).send({
        success:true,
        message:"category deleted",
        category
       })
    }
    catch(err){
        res.status(500).send({
            success:false,
            message:"Error in delete category",
            err
        })
    }
}
module.exports={createCategoryController,updatecategoryController,categorysController,singlecategoryController,deletecategoryController};