const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const app = express();
require("dotenv").config()


const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisissecrctekeyECommercefhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());


app.listen(process.env.PORT,()=>{
    console.log("Server is Listening on port: "+process.env.PORT);
})