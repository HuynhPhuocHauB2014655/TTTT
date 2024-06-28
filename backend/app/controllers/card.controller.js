const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const CardService = require("../services/card.service");

exports.checkCard = async (req, res, next) => {
    const cardService = new CardService(MongoDB.client);
    try {
        const document = cardService.checkCard(req.body);
        if (document && req.body.cardType == 1) {
            const exitsCard = await cardService.findByCardNum(req.body.cardNum);
            if (!exitsCard) {
                await cardService.create(req.body);
            }
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Có lỗi khi xử lí giao dịch")
        )
    }
}
exports.delete = async (req, res, next) => {
    const id = req.params.id;
    const cardService = new CardService(MongoDB.client);
    try {
        const result = await cardService.delete(id);
        if (result) {
            return res.send("Đã xóa thẻ thành công!")
        }
    } catch (error) {
        return next(
            new ApiError(500, "Có lỗi khi xóa thẻ!")
        )
    }
}
exports.deleteAll = async (req, res, next) => {
    const cardService = new CardService(MongoDB.client);
    try {
        const result = await cardService.deleteAll();
        return res.send(`Đã xóa ${result} thẻ.`);
    } catch (error) {
        return next(
            new ApiError(500, "Có lỗi khi xóa thẻ!")
        )
    }
}
exports.findAll = async (req, res, next) => {
    const userName = req.params.id;
    cardType = req.query.cardType;
    const cardService = new CardService(MongoDB.client);
    try {
        let document = await cardService.findAll(userName, cardType);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "Có lỗi khi tìm kiếm thẻ!")
        )
    }
}