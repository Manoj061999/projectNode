'use strict';

const httpErrors = require("http-errors");
let order = require("./service");
const uuid = require('uuid');
const JWT = require("jsonwebtoken");

const CreateOrder = async(req , res)=> {
try{
    req.body.orderid = uuid();
    req.body.totalprice = req.body.productprice * req.body.productquantity;
    req.body.status = 'PLACED';

    var date = new Date();
    req.body.createdOn=date.toISOString().slice(0,10) +" "+ date.toISOString().slice(11,19);
    
    const saveorder = await order.SaveOrderDetails(req.body);
    if(saveorder){
        res.send({status:200 , result:'success' , message:'Successfully Saved!'});
    }else{
        res.send({status:400 , result:'fail' , message:'Some thing went wrong!'});
    }
}catch(err){
    res.send({status:400 , result:'wrong' , msg:'SOME THING WENT WRONG!'});
}
    
}


const UpdateOrders = async(req , res)=> {
    try{
    const viewOrders = await order.ViewOrderDetails({orderid:req.body.orderid});
    if(viewOrders.length!=0){

        req.body.totalprice = viewOrders[0].productprice * req.body.productquantity;

        const date = new Date();
        req.body.createdOn=date.toISOString().slice(0,10) +" "+ date.toISOString().slice(11,19);

        const updateorder = await order.UpdateOrder(req.body);
        if(updateorder){
            res.send({status:200 , result:'success' , message:'Unpdated Successfully!'});
        }else{
            res.send({status:400 , result:'fail' ,message:'some thing went wrong!'});
        }
    }else{
        res.send({status:400 , result:'wrong' , message:'No Orders Found!'});
    }
    }catch(err){
        res.send({status:400 , msg:'SOME THING WENT WRONG!'});
    }
}


const CancleOrders = async(req , res)=> {
try{
const vieworder = await order.ViewOrderDetails({orderid:req.body.orderid});
if(vieworder.length!=0){
    
const date = new Date();
req.body.createdOn=date.toISOString().slice(0,10)+ " " + date.toISOString().slice(11,19);

const cancledata = await order.CancleOrderDetails(req.body);
if(cancledata){
    res.send({status:200 , result:'success' , message:'Cancled Successfully!'});
}else{
    res.send({status:400 , result:'fail' , message:'some thing went wrong!'});
}
}else{
    res.send({status:400 , result:'wrong' , message:'No Orders Found!'});
}
}catch(err){
    res.send({status:400 , msg:'SOMWE THING WENT WRONG!'});
}
}

const ViewOrderData = async(req , res)=>{
    try{
    const vieworder = await order.ViewOrderDetails(req.query);
    if(vieworder.length!=0){
        res.send({status:200 , result:'success' , message:vieworder});
    }else{
        res.send({status:400 , result:'fail' , message:'No orders Found'});
    }
}catch(err){
    res.send({status:400 , result:'wrong' , message:'SOME THING WENT WRONG!'});
}
}

const ViewPlacedOrderCount = async(req , res)=> {
    try{
    const vieworder = await order.PlacedOrder({});
    if(vieworder.length!=0){
        res.send({status:200 , result:'success' ,message:vieworder});
    }else{
        res.send({status:400 , result:'fail' , message:'No records Found!'});
    }
}catch(err){
    res.send({status:400 , result:'wrong' , msg:'SOME THING WENT WRONG!'});
}
}

const ViewPurshasedCount = async(req , res)=> {
try{
    const vieworderS = await order.PurchasedOrder({});
    if(vieworderS.length!=0){
        res.send({status:200 , result:'success' , message:vieworderS});
    }else{
        res.send({status:400 , result:'fail' , message:'No records found!'});
    }
}catch(err){
    res.send({status:400 , msg:'SOME THING WENT WRONG!'});
}
}

const ViewCancledCount = async(req , res)=> {
    try{
    const cancleorder = await order.CancledOrders({});
    if(cancleorder.length!=0){
        res.send({status:200 , result:'success' , message:cancleorder});
    }else{
        res.send({status:400 , result:'fail' , message:'No Cancled orders Found!'});
    }
    }catch(err){
        return false
    }
}


const DeleteOrder = async(req , res)=> {
    try{
    const vieworder = await order.DoDeleteDetails({orderid:req.body.orderid});
    if(vieworder.length!=0){

    const deletedata = await order.DeleteOrderDetails(req.body);
    if(deletedata){
        res.send({status:200 , result:'success' , message:'Deleted Successfully!'});
    }else{
        res.send({status:400 , result:'fail' , message:'some thing went wrong!'});
    }
    }else{
        res.send({status:400 , result:'wrong' , message:'No Order Found!'});
    }
}catch(err){
    res.send({status:400 , result:'wrong' , msg:'SOME THING WENT WRONG!'});
}
}




module.exports = {
    CreateOrder,
    UpdateOrders,
    CancleOrders,
    ViewOrderData,
    ViewPlacedOrderCount,
    ViewPurshasedCount,
    ViewCancledCount,
    DeleteOrder
    
}