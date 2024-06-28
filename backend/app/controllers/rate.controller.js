const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const RateService = require("../services/rate.service");

exports.create = async (req, res, next) => {
    const rateService = new RateService(MongoDB.client);
    try {
        const document = await rateService.create(req.body);
        if(document){
            return res.send(document);
        }
    }catch(error){
        return next(
            new ApiError(500, "An error ocurreed while creating rate")
        );
    }
}
exports.update = async (req, res, next) => {
    const id = req.params.id;
    const rateService = new RateService(MongoDB.client);
    try{
        const updatedDocument = await rateService.update(id, req.body);
        if(!updatedDocument){
            return next(
                new ApiError(400, "Rate not found")
            );
        }
        else{
            return res.status(200).json({"message":"Updated successfully!"});
        }
    }catch(error){
        return next(new ApiError(500,"Failed to update the rating"));
    }
}
exports.getByBookId = async (req, res, next) => {
    const bookId = req.params.bookId;
    const rateService = new RateService(MongoDB.client);
    try{
        const rates = await rateService.getByBookId(bookId);
        if(!rates || rates.length === 0){
            return next(
                new ApiError(400, "Rate not found")
            );
        }
        else{
            return res.status(200).json(rates);
        }
    }catch(error){
        return next(new ApiError(500,"Failed to find the rating"));
    }
}
exports.findOne = async (req, res, next) => {
    const rateService = new RateService(MongoDB.client);
    try{
        const rate = await rateService.findOne(req.body);
        if(!rate){
            return next(
                new ApiError(400, "User has no review for this book.")
            );
        }
        else{
            return res.send(rate);
        }
    }catch(error){
        return next(new ApiError("Internal server error", 500));
    }
}
exports.getAverageRating = async (req, res, next) => {
    const bookId = req.query.id;
    const rateService = new RateService(MongoDB.client);
    try{
        const avgRating = await rateService.getAverageRating(bookId);
        return res.status(200).json({avg_rating:avgRating});
    }catch(error){
        return next(new ApiError("Internal server error", 500));
    }
}
