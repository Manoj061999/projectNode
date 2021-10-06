const { Router } = require("express");
var express = require("express");

const router = express.Router();

let user = require("../controller/user/index");
let order = require("../controller/order/index");


let routes = (app)=> {

    router.post("/user",user.adduser);
    router.post("/LoginUser",user.LoginUser);

    router.post("/CreateOrder",order.CreateOrder);
    router.post("/UpdateOrders",order.UpdateOrders);
    router.post("/CancleOrders",order.CancleOrders);
    router.post("/DeleteOrder",order.DeleteOrder);

    router.get("/ViewOrderData",order.ViewOrderData);
    router.get("/PlacedCount",order.ViewPlacedOrderCount);
    router.get("/purchasedCount",order.ViewPurshasedCount);
    router.get("/CancledCount",order.ViewCancledCount);

    app.use("/api", router);
};


module.exports = routes