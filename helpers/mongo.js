const MongoClient = require('mongodb').MongoClient;
require("dotenv").config()
async function connectDB(){
    let client= await MongoClient.connect(process.env.MONGO_URL,{ useNewUrlParser: true });
    global.mongoDB = client.db(process.env.MONGO_DATABASE_NAME);
    console.log("Mongo DB Connected")
}
function insertOne(collection,object){
    global.mongoDB.collection(collection).insertOne(object, function(err, res) {
        if (err) throw err;
    });
}

function find(collection,query={},projection){
    return new Promise(async (resolve,reject)=>{
        if(projection){
            let result = await global.mongoDB.collection(collection).find(query,{projection: projection}).toArray();
            resolve(result);
        }else{
            let result = await global.mongoDB.collection(collection).find(query).toArray();
            resolve(result);
        }

    })
}

function insertMany(collection,objects){
    global.mongoDB.collection(collection).insertMany(objects, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
    });
}
module.exports = {
    connectDB,
    insertOne,
    find,
    insertMany
};