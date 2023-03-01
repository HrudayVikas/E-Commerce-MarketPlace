const {StatusCodes} = require('http-status-codes');
const mongoQueries = require('../helpers/mongo');
const { v4: uuidv4 } = require('uuid');
async function createCatalog(req,res){
    if(!req.body.catalog_name || !req.body.products || !Array.isArray(req.body.products)){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide valid request body"
        })
    }
    console.log(req.body.products);
    let id=req.session.uuid;
    let username_result = await mongoQueries.find("catalogs", {seller_id: id});
    if(username_result.length == 0){
        let catalog_id=uuidv4();
        let insert_catalog={
            catalog_name: req.body.catalog_name,
            seller_id: id,
            catalog_id: catalog_id
        };
        mongoQueries.insertOne("catalogs",insert_catalog);
        let products=[];
        for(const product of req.body.products){
            if(typeof product.product_name=="undefined" && typeof product.product_cost=="undefined"){
                return res.status(StatusCodes.BAD_REQUEST).send({
                    message:"Please provide valid request body"
                })
            }
            let product_item={
                product_name: product.product_name,
                product_cost: product.product_cost,
                catalog_id: catalog_id,
                product_id:uuidv4()
            }
            products.push(product_item);
        }
        mongoQueries.insertMany("products",products);
        return res.status(StatusCodes.OK).send({
            message:"Category and Product Added"
        })
    }else{
        return res.status(StatusCodes.OK).send({
            message:"Only one catalog is allowed per Seller"
        })
    }

}

async function getListOrders(req,res){
    let id=req.session.uuid;
    let orders = await mongoQueries.find("orders", {seller_id: id},{_id:0});
    return res.status(StatusCodes.OK).send(orders)
}

module.exports = {
    createCatalog,
    getListOrders
};