const {StatusCodes} = require('http-status-codes');
const mongoQueries = require('../helpers/mongo');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
async function register(req,res){
    if(!req.body.username || !req.body.password || !req.body.confirm_password || !req.body.type){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide valid request body"
        })
    }
    if(req.body.type!=="buyer" && req.body.type!=="seller"){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide a valid type"
        })
    }
    let username = req.body.username;
    let password = req.body.password;
    let confirm_password = req.body.confirm_password;
    let type = req.body.type;
    if(password===confirm_password){
        const hash = await bcrypt.hash(password, 10);
        let insert_record = {
            user_id: uuidv4(),
            username : username,
            password : hash,
            type : type
        };
        let find_user = await mongoQueries.find("users",{username: username,type:type});
        if(find_user.length==0){
            mongoQueries.insertOne("users",insert_record);
            return res.status(StatusCodes.OK).send({
                message: "User Registered successfully"
            })
        }else{
            return res.status(StatusCodes.OK).send({
                message: "Duplicate User Found"
            })
        }
    }else{
        return res.status(StatusCodes.OK).send({
            message:"Passwords are not matching"
        })
    }

}

async function login(req,res){
    if(!req.body.username || !req.body.password || !req.body.type){
        return res.status(StatusCodes.BAD_REQUEST).send({
            message:"Please provide valid request body"
        })
    }
    let username = req.body.username;
    let password = req.body.password;
    let type = req.body.type;
    let username_result = await mongoQueries.find("users", {username: username,type:type});
    if(username_result.length==1){
        let db_result=username_result[0];
        const result = await bcrypt.compare(password, db_result.password);
        if(result){
            req.session.uuid = db_result.user_id;
            req.session.type = db_result.type;
            console.log(req.session);
            return res.status(StatusCodes.OK).send({
                message:"User Logged In"
            })
        }else{
            return res.status(StatusCodes.BAD_REQUEST).send({
                message:"Invalid Password"
            })
        }
    }else{
        return res.status(StatusCodes.FORBIDDEN).send({
            message: "User not found"
        })
    }
}

async function logout(req,res){
    req.session.destroy();
    return res.status(StatusCodes.OK).send({
        message: "User Logged Out"
    })
}
module.exports = {
    register,
    login,
    logout
};