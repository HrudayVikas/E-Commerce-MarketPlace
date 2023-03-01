const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const mongoQueries = require("./helpers/mongo");
const app = express();
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const buyerRoutes = require("./routes/buyerRoutes")
const sellerRoutes = require("./routes/sellerRoutes")

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: process.env.SECRET_KEY,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(authRoutes);
app.use(buyerRoutes);
app.use(sellerRoutes);

mongoQueries.connectDB();
app.listen(process.env.PORT,()=>{
    console.log("Server is Listening on port: "+process.env.PORT);
})