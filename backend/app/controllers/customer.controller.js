const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CustomerService = require("../services/customer.service");

exports.create = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const document = await customerService.create(req.body);
        if(document == null)
        {
            return next(
                new ApiError(400, "Tên đăng nhập đã tồn tại")
            );
        }
        return res.send("Tài khoản đã được tạo thành công");
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the customer")
        );
    }
};
exports.getIP = async (req, res, next) =>{
    return res.send(req.connection.remoteAddress);
}
exports.login = async (req, res, next) => {
    try {
        const customerService = new CustomerService(MongoDB.client);
        const user = await customerService.findOne(req.body.username);
        if(!user){
            return next(
                new ApiError(405, `Tên đăng nhập không đúng.`)
            );
        }
        const document = await customerService.login(user._id,req.body.password);
        if(document){
            return res.send(document);
        }
        else
        {
            return next(
                new ApiError(400, `Mật khẩu không đúng.`)
            );
        }
    } catch (error) {
        return next(
            new ApiError(500, `Error when login`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400,'Data to update can not be empty'));
    }
    try {
        const customerService = new CustomerService(MongoDB.client);
        if(req.body.old_password)
        {
            const password = await customerService.decryptPassword(req.params.id);
            if(req.body.old_password != password)
            {
                return next(new ApiError(404, 'Mật khẩu không đúng'));
            }
        }
        const document = await customerService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, 'Customer not found'));
        }
        return res.send({message: "Customer was update successfully"});
    } catch (error) {
        return next (
            new ApiError(500,  `Error updating Customer with id=${req.params.id}` )
        );
    }
};
exports.findOne = async (req,res,next) => {
    try 
    {
        const customerService = new CustomerService(MongoDB.client);
        const result = await customerService.findOne(req.params.id);
        return res.send(result);
    }
    catch (error) {
        return next (
            new ApiError(500,  `Error while searching id=${req.params.id}` )
        );
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const bookService = new CustomerService(MongoDB.client);
        documents = await bookService.find({});
    } catch (error) {
        return next(
            new  ApiError(500, "An error occurred while retrieving customer")
        );
    }
    return res.send(documents);
};
