const { ObjectId } = require("mongodb");
class CartService {
    constructor(client) {
        this.Cart = client.db().collection("cart");
    }
    extractCartData(username, payload) {

        const cart = {
            username: username,
            bookId: payload.bookId,
            price: payload.price,
            quantity: payload.quantity,
            hinh:payload.hinh,
            tensach:payload.tensach
        };
        
        Object.keys(cart).forEach(
            (key) => cart[key] === undefined && delete cart[key]
        );
        return cart;
    }

    async create(username, payload) {
            const cart = this.extractCartData(username, payload);
            await this.Cart.insertOne(
                cart,
                { returnDocument: "after", upsert: true },
            );
            return "Tao gio hang thanh cong";
    }

    async find(username) {
        const  cursor = await this.Cart.find({username: username});
        return await cursor.toArray();
    }
    async findOne(username,bookId){
        return await this.Cart.findOne({username: username , bookId :bookId});
    }
    async update(username, payload) {
        const filter = {
            username: username,
            bookId:payload.bookId,
        };
        const update = this.extractCartData(username, payload);
        const result = await this.Cart.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(username, bookId) {
        const filter = {
            username: username,
            bookId: bookId       
        };
        const result = await this.Cart.deleteOne(filter);
        ;
        return result;
    }

    async deleteAll(username) {
        const result = await this.Cart.deleteMany({
            username: username,
        });
        return result.deletedCount;
    }
}
module.exports = CartService;
