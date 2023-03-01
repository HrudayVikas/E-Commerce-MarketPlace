const mongoQueries = require('../helpers/mongo');
const {StatusCodes} = require('http-status-codes');
const { v4: uuidv4 } = require('uuid');
async function getAllSellers(req,res){
    let sellers = await mongoQueries.find("users", {type: "seller"});
    console.log(sellers);
    let response = {};
    for(const seller of sellers){
        response[seller.username]=seller.user_id;
    }
    console.log(response);
    return res.status(StatusCodes.OK).send(response)
}

async function getCatalogBySeller(req,res){
    if(!req.params.seller_id){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide valid request body"
        });
    }
    console.log(req.params.seller_id);
    let req_seller_id = req.params.seller_id;
    let catalog = await mongoQueries.find("catalogs", {seller_id: req_seller_id});
    let products = await mongoQueries.find("products", {catalog_id:catalog[0].catalog_id},{_id:0,product_id:1,product_name:1,product_cost:1});
    return res.status(StatusCodes.OK).send(products);
}

async function createOrder(req,res){
    if(!req.body.orders || typeof req.body.orders !== "object"){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide valid request body"
        })
    }
    let orders = req.body.orders;
    let seller_id = req.params.seller_id;
    let user_id = req.session.uuid;
    let insert_orders = [];
    for(const order in orders){
        let get_product = await mongoQueries.find("products",{product_id:order});
        if(get_product.length > 0){
            if(isNaN(orders[order])){
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message:"Invalid Request"
                })
            }
            let total_cost = orders[order] * get_product[0].product_cost;
            let total_order={
                order_id:uuidv4(),
                user_id:user_id,
                seller_id:seller_id,
                product_id:get_product[0].product_id,
                product_name:get_product[0].product_name,
                total_bill:total_cost
            }
            insert_orders.push(total_order);
        }else{
            return res.status(StatusCodes.BAD_REQUEST).send({
                message:"Invalid Product ID"
            })
        }
        
    }
    mongoQueries.insertMany("orders",insert_orders);
    return res.status(StatusCodes.OK).send({
        message:"Order Created"
    })
}

module.exports = {
    getAllSellers,
    getCatalogBySeller,
    createOrder
};