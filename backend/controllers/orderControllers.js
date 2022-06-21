const Order = require("../models/orderModels");

const Product = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncerrors = require("../middleware/catchAsyncerrors");


//create new order
exports.newOrder =  catchAsyncerrors(async(req,res,next)=>{

    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    });
});

//Get Single order

exports.getSingleOrder = catchAsyncerrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with id ",404));
    }

    res.status(200).json({
        success:true,
        order
    })
});

//Get loggedin user orders

exports.myOrders = catchAsyncerrors(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })

});

//Get all orders--admin

exports.getAllOrders = catchAsyncerrors(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })

});

//Update Order status--admin

exports.updateOrder = catchAsyncerrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);


    if(!order){
        return next(new ErrorHandler("Order not found with id ",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("oyu have already delivered this order ",404));
    }

    if (req.body.status === "Shipped") {
    order.orderItems.forEach(async(order)=>{
        await updateStock(order.product,order.quantity);
    });
}

    order.orderStatus = req.body.status;
   
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();

    }

    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })

});

async function updateStock(id,quantity){

    const product = await Product.findById(id);

    product.stock-=quantity;

    await product.save({validateBeforeSave:false});
}

//delete orders--admin

exports.deleteOrder = catchAsyncerrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with id ",404));
    }

   await order.remove()


    res.status(200).json({
        success:true,
        
    })

});
