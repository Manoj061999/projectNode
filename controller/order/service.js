'use strict';
const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    "orderid": String,
    "productname": String,
    "productquantity": Number,
    "productprice": Number,
    "totalprice":Number,
    "address":String,
    "paymentmethod":String,
    "status":String,
    "mobile":String,
    "email":String,
    "firstname":String,
    "lastname":String,
    "isActive":Boolean,
    "createdOn":String,
  });

const model = mongoose.model('order', orderSchema);

const SaveOrderDetails = async(data)=> {
    try{
    const order = new model(data);
    const saveorder = await order.save();
    return saveorder
    }catch(err){
        return false
    }
}


const ViewOrderDetails = async(data)=> {
try{
    var order;
    var query = [];
    query.push({$match:{"status":"PLACED"}})
    if(data.orderid){

        query.push({$match: {orderid:data.orderid}});
    }
    if(data.mobile){
        
        query.push({$match : {mobile: data.mobile}});
    }
    if(data.searchdata){

        query.push({$match: {$or: [{email:data.searchdata},
                                    {mobile:data.searchdata},
                                    {orderid:data.searchdata},
                                    {firstname:data.searchdata}] }})
    }if(data.sortvalue)
        {
            query.push({ $sort : { createdOn: parseInt(data.sortvalue) } })
        }
    order = await model.aggregate([
        query
    ]);
    return order;
}catch(err){
    return false
}
}

const UpdateOrder = async(data)=>{
    try{
    const updatedata = await model.updateMany(
        {"orderid":data.orderid},
        {$set: {"productquantity":data.productquantity,
                "totalprice":data.totalprice,
                "address":data.address,
                "isActive":true,
                "createdOn":data.createdOn}},
            {new : true}
        );
    return updatedata;
    }catch(err){
        return false
    }
}

const CancleOrderDetails = async(data)=>{
    try{
    const concleorder = await model.updateMany(
        {"orderid":data.orderid},
        {$set: {"status":'CANCELLED',
                "createdOn":data.createdOn}},
            { new : true}
        );
        return concleorder
    }catch(err){
        return false
    }
}

const PlacedOrder = async()=>{
    try{
    const vieworder = await model.aggregate([
        {$match:{status:"PLACED"}},
        {$group: {
            _id: { date: { $substr: [ "$createdOn",0 ,10]},
                    time: {$substr: [ "$createdOn",11 ,19]},
                    productname:"$productname",
                    productprice:"$productprice",
                    productquantity:"$productquantity",
                    totalprice:"$totalprice",
                    isActive:"$isActive"},
                    count: {$sum : 1}
        }}
    ]);
    return vieworder
}catch(err){
    return false
}
}

const PurchasedOrder = async()=>{
    try{
    const vieworder = await model.aggregate([
        {$match: {status:"COMPELTED"}},
        {$group: {
            _id: {date: {$substr: [ "$createdOn",0 ,10]},
                  time: {$substr: [ "$createdOn",11 ,19]},
                  productname:"$productname",
                  productquantity:"$productquantity",
                  productprice:"$productprice",
                  totalprice:"$totalprice",
                  isActive:"$isActive"},
                  count : {$sum: 1}
        }}
    ]);
    return vieworder
}catch(err){
    return false
}
}

const CancledOrders = async()=>{
    try{
    const cancledata = await model.aggregate([
        {$match: {status:"CANCELLED"}},
        {$group: {
            _id: {date: {$substr: [ "$createdOn", 0,10]},
                 time: {$substr: [ "$createdOn",11 ,19]},
                    productname:"$productname",
                    productprice:"$productprice",
                    totalprice:"$totalprice",
                    isActive:"$isActive"},
                    count : {$sum : 1}
        }},
    ]);
    return cancledata
}catch(err){
    return false
}
}

const DoDeleteDetails = async(data)=>{
    try{
    var deletes;
    var query = [];
    query.push({$match: {"status":"CANCELLED"}});
    if(data.orderid){ 

        query.push({$match: {orderid:data.orderid}});
    }
    if(data.mobile){

        query.push({$match:{mobile:data.mobile}});
    }
    if(data.searchdata){

        query.push({$match: {$or: [{email:data.email},
                                    {mobile:data.mobile},
                                    {orderid:data.orderid},
                                    {productname:data.productname}] }})
    }
    deletes = await model.aggregate([
        query
    ]);
    return deletes
}catch(err){
    return false
}

}

const DeleteOrderDetails = async(data)=>{
    try{
    const deletedata = await model.deleteOne({orderid:data.orderid});
    return deletedata
    }catch(err){
        return false
    }
} 



module.exports = {
    SaveOrderDetails,
    ViewOrderDetails,
    UpdateOrder,
    CancleOrderDetails,
    PlacedOrder,
    PurchasedOrder,
    CancledOrders,
    DoDeleteDetails,
    DeleteOrderDetails
};
