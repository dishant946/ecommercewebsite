const express=require('express');
const {registerController, updateProfileController}=require('../Controllers/authController.js');
const {loginController}=require('../Controllers/authController.js');
const {testController}=require('../Controllers/authController.js');
const {forgotpasswordController}=require('../Controllers/authController.js');
const {requireSignIn,isAdmin}=require('../Middlewares/authMiddleware.js');
const router=express.Router();
router.post('/register',registerController);
router.post('/login',loginController);
router.get('/test',requireSignIn,isAdmin,testController);
router.post('/forgot-password',forgotpasswordController);
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});

router.put('/profile',requireSignIn,updateProfileController);
module.exports=router;
