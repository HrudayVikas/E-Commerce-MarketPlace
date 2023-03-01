const express = require("express");
const buyerController = require("../controllers/buyerController");
const {checkBuyerAuth} = require("../middlewares/authMiddeware")
const buyerroutes = express();

buyerroutes.get("/api/buyer/list-of-sellers",checkBuyerAuth,buyerController.getAllSellers);
buyerroutes.get("/api/buyer/seller-catalog/:seller_id",checkBuyerAuth,buyerController.getCatalogBySeller);
buyerroutes.post("/api/buyer/create-order/:seller_id",checkBuyerAuth,buyerController.createOrder);

module.exports = buyerroutes;