const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const SupportService = require("../services/support.service");


exports.create = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.create(req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Thêm hỗ trợ thất bại"),
        )
    }
}
exports.update = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.update(req.body.id,req.body);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Sửa hỗ trợ thất bại"),
        )
    }
}
exports.find = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.find(req.params.userName);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Tìm hỗ trợ thất bại"),
        )
    }
}
exports.findAll = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.findAll();
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Tìm hỗ trợ thất bại"),
        )
    }
}
exports.findById = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.findById(req.params.id);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Tìm hỗ trợ thất bại"),
        )
    }
}
exports.delete = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.delete(req.params.id);
        return res.send(document);
    }catch(error){
        return next(
            new ApiError(500,"Xóa hỗ trợ thất bại"),
        )
    }
}
exports.deleteAll = async (req, res, next) => {
    const supportService = new SupportService(MongoDB.client);
    try{
        const document = await supportService.deleteAll();
        return res.send(`Đã xóa ${document.deletedCount} đối tượng`);
    }catch(error){
        return next(
            new ApiError(500,"Xóa hỗ trợ thất bại"),
        )
    }
}