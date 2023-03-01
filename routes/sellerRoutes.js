const express = require("express");
const sellerController = require("../controllers/sellerController");
const {checkSellerAuth} = require("../middlewares/authMiddeware")
const sellerroutes = express();

sellerroutes.post("/api/seller/create-catalog",checkSellerAuth,sellerController.createCatalog);
sellerroutes.get("/api/seller/orders",checkSellerAuth,sellerController.getListOrders);

module.exports = sellerroutes;