const express = require("express");
const authController = require("../controllers/authController");
const authroutes = express();

authroutes.post("/api/auth/register",authController.register);
authroutes.post("/api/auth/login",authController.login);
authroutes.get("/api/auth/logout",authController.logout);

module.exports = authroutes;