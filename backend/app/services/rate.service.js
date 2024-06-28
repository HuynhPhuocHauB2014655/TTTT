const { ObjectId } = require("mongodb");
class RateService {
    constructor(client) {
        this.Rate = client.db().collection("rate");
    }
    extractRateData(payload) {
        const rate = {
            username: payload.username,
            hoten: payload.hoten,
            bookId: payload.bookId,
            rating: Number(payload.rating),
            review: payload.review,
            orderId: payload.orderId
        };
        Object.keys(rate).forEach(
            (key) => rate[key] === undefined && delete rate[key]
        );
        return rate;
    }
    async create(payload) {
        const newRate = this.extractRateData(payload);
        const document = await this.Rate.insertOne(
            newRate,
            { returnDocument: "after", upsert: true },
        );
        return document;
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        console.log(filter);
        const rate = this.extractRateData(payload);
        const result = await this.Rate.findOneAndUpdate(
            filter,
            { $set: rate },
            { returnDocument: "after" },
        );
        console.log(result)
        return result;
    }
    async getByBookId(id) {
        const filter = {
            bookId: id,
        }
        const options = { sort: { _id: -1 } };
        const result = await this.Rate.find(filter, null, options).toArray();
        return result;
    }
    async findOne(payload) {
        const filter = {
            bookId: payload.bookId,
            orderId: payload.orderId
        };
        const rate = await this.Rate.find(filter).toArray();
        return rate;
    }
    async getAverageRating(id) {
        const filter = {
            bookId: id,
        };
        let total = 0;
        const rating = await this.Rate.find(
            filter,
        ).toArray();
        if (rating.length > 0) {
            rating.forEach(rate => {
                total += rate.rating;
            });
            return total / rating.length;
        }
        return 0;
    }
}
module.exports = RateService;