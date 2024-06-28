const { ObjectId } = require("mongodb");
class BookService {
    constructor(client) {
        this.Book = client.db().collection("books");
    }
// Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

    extractBookData(payload) {
        const book = {
            _id: payload._id,
            tensach: payload.tensach,
            hinh: payload.hinh,
            theloai: payload.theloai,
            sotrang: payload.sotrang,
            nxb: payload.nxb,
            gia: payload.gia,
            soquyen: payload.soquyen,
            ngonngu:  payload.ngonngu,
        };
        // Remove undefined fields
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
            const book = this.extractBookData(payload);
            const result = await this.Book.insertOne(
                book,
                { returnDocument: "after", upsert: true },
            );
            return result;
    }

    async find(filter) {
        const cursor = await this.Book.find(filter);
            return await cursor.toArray();
        }

    async findByName(tenSach) {
        return await this.Book.find({
            tensach: { $regex: new RegExp(tenSach), $options: "i" },
        }).toArray();
    }

    async findById(id) {
        return await this.Book.findOne({
            _id: id
        });
    }
    async update(id, payload) {
        const filter = {
            _id: id,
        };
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Book.findOneAndDelete({
            _id: id,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = BookService;
