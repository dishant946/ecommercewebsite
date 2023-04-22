const productmodel = require('../Models/productModel.js');
const fs = require('fs');
const categoryModel = require('../Models/categoryModel.js');
const slugify = require('slugify');
const braintree = require('braintree');
const orderModel = require('../Models/orderModel.js');
const dotenv=require('dotenv');
dotenv.config();
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createproductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" });
            case !description:
                return res.status(500).send({ error: "description is required" });
            case !name:
                return res.status(500).send({ error: "name is required" });
            case !price:
                return res.status(500).send({ error: "price is required" });
            case !category:
                return res.status(500).send({ error: "category is required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is required" });
            case !(photo && photo.size > 100000):
                return res.status(500).send({ error: "photo  is required and less than 1mb" });
        }
        const products = new productmodel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "product created successfully",
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in create product",
            success: false,
            err
        })
    }
}
const getproductController = async (req, res) => {
    try {
        const products = await productmodel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: "All Product",
            products,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in get product",
            success: false,
            err
        })
    }
}
const getsingleproductController = async (req, res) => {
    try {
        const products = await productmodel.findOne({ slug: req.params.slug }).select('-photo').populate('category');
        res.status(200).send({
            success: true,
            message: "Single Product displayed",
            products,
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in get product",
            success: false,
            err
        })
    }
}
const productphotoController = async (req, res) => {
    try {
        const product = await productmodel.findById(req.params.id).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in getting photo",
            success: false,
            err
        })
    }
}
const deleteProductController = async (req, res) => {
    try {
        await productmodel.findByIdAndDelete(req.params.pid).select('-photo');
        return res.status(200).send({
            message: "Product Deleted successfully",
            success: true
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in getting photo",
            success: false,
            err
        })
    }
}
const updateproductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        //validation 
        switch (true) {
            case !name:
                return res.status(500).send({ error: "name is required" });
            case !description:
                return res.status(500).send({ error: "description is required" });
            case !name:
                return res.status(500).send({ error: "name is required" });
            case !price:
                return res.status(500).send({ error: "price is required" });
            case !category:
                return res.status(500).send({ error: "category is required" });
            case !quantity:
                return res.status(500).send({ error: "quantity is required" });
            case !(photo):
                return res.status(500).send({ error: "photo  is required and less than 1mb" });
        }
        const products = await productmodel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(201).send({
            success: true,
            message: "product Updated successfully",
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productmodel.find(args);
        res.status(200).send({
            success: true,
            products
        })
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const productcountController = async (req, res) => {
    try {
        const total = await productmodel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const productListController = async (req, res) => {
    try {
        const perpage = 2;
        const page = req.params.page ? req.params.page : 1;
        const products = await productmodel.find({}).select('-photo').skip((page - 1) * perpage).limit(perpage).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products
        })

    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const searchController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productmodel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        }).select('-photo');
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productmodel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(3).populate('category');
        res.status(200).send({
            success: true,
            products
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const product = await productmodel.find({ category }).populate('category');
        res.status(200).send({
            success: true,
            category,
            product
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            message: "Error in update product",
            success: false,
            err
        })
    }
}
const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, result) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.send(result);
            }
        })
    } catch (err) {
        console.log(err);
    }
}
const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => { total += i.price });
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true
            }
        },
            function (err, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true });
                }
                else {
                    res.status(500).send(err);
                }
            })
    } catch (err) {
        console.log(err);
    }
}
module.exports = { createproductController, getproductController, getsingleproductController, productphotoController, deleteProductController, updateproductController, productFilterController, productcountController, productListController, searchController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController };