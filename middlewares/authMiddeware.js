const {StatusCodes} = require('http-status-codes');

function checkSellerAuth(req,res,next){
    if(!req.session || req.session.type !== 'seller'){
        return res.status(StatusCodes.UNAUTHORIZED).send({message:"Unauthorized"});
    }
    next();
}

function checkBuyerAuth(req,res,next){
    if(!req.session || req.session.type !== 'buyer'){
        return res.status(StatusCodes.UNAUTHORIZED).send({message:"Unauthorized"});
    }
    next();
}
module.exports = {
    checkSellerAuth,
    checkBuyerAuth
};