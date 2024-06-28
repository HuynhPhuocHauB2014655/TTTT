const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CartService = require("../services/cart.service");

exports.create = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const exitscart = await cartService.findOne(req.params.username,req.body.bookId);
        if(exitscart)
        {
            exitscart.quantity += req.body.quantity;
            const document = await cartService.update(req.params.username, exitscart);
            return res.send(document);
        }
        else
        {
            const document = await cartService.create(req.params.username, req.body);
            return res.send(document);
        }      
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the cart")
        );
    }
};


exports.findAll = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const documents = await cartService.find(req.params.username);
        if(!documents){
            return next(new ApiError(404,"Cart not found"));
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving cart with id=${req.params.username}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400,'Data to update can not be empty'));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.update(req.params.username, req.body);
        if(!document) {
            return next(new ApiError(404, 'Cart not found'));
        }
        return res.send({message: "Cart was update successfully"});
    } catch (error) {
        return next (
            new ApiError(500,  `Error updating book with id=${req.params.username}` )
        );
    }
};

exports.delete = async (req, res, next) => {
    try {

        const cartService = new CartService(MongoDB.client);
        const document = await cartService.delete(req.params.username, req.params.bookId);
        if (!document) {
            return next(new ApiError(404, 'Cart not found'));
        }
        return res.send({message: "Cart was deleted successfully"});
    } catch (error) {
        return next(new ApiError(500, `Could not delete book with id= ${req.params.bookId}`));
    }
}

exports.deleteAll = async (req, res, next) => {
    try {
        const contactsService = new CartService(MongoDB.client);
        const deleteCount = await contactsService.deleteAll(req.params.username);
        return res.send({
            message : `${deleteCount} cart were deleted`
        });
    } catch (error) {
        return next (
            new ApiError(500, "An error occurred while removing all carts")
        );
    }
};
