const express=require('express');
const router=express.Router();
const {requireSignIn,isAdmin} =require('../Middlewares/authMiddleware.js');
const {createproductController,getproductController,getsingleproductController,productphotoController,deleteProductController,updateproductController,productFilterController,productcountController,productListController,searchController,relatedProductController,productCategoryController, braintreeTokenController,braintreePaymentController}=require('../Controllers/ProductController.js');
const formidable=require('express-formidable');

router.post('/create-product',requireSignIn,isAdmin,formidable(),createproductController);
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateproductController);
router.get('/get-product',getproductController);
router.get('/get-product/:slug',getsingleproductController);
router.get('/product-photo/:id',productphotoController);
router.delete('/delete-product/:pid',deleteProductController);

router.post('/product-filters',productFilterController);
router.get('/product-count',productcountController);
router.get('/product-list/:page',productListController);
router.get('/search/:keyword',searchController);
router.get('/related-product/:pid/:cid',relatedProductController);
router.get('/product-category/:slug',productCategoryController);

router.get('/braintree/token', braintreeTokenController);
router.post('/braintree/payment',requireSignIn,braintreePaymentController);
module.exports=router;