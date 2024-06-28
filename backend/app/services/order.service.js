class OrderService
{
    constructor(client) {
        this.Order = client.db().collection("order");
    }
    extractOderData(payload)
    {
        let order;
        if(payload.bookId){
            order = {
                _id: new Date().toISOString().substr(0, 19) + payload.username,
                username: payload.username,
                bookId : payload.bookId.map((item) => ({
                    bookId: item.bookId,
                    price: item.price,
                    quantity: item.quantity,
                    hinh:item.hinh,
                    tensach:item.tensach,
                  })),
                total: payload.total,
                status: "Chờ xác nhận",
                date: payload.date,
                rating:payload.rating
            }
        }
        else
        {
            order = {
                _id: payload.id,
                username: payload.username,
                total: payload.total,
                status: payload.status,
                date: payload.date,
                rating:payload.rating
            }
        }
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
        return order;
    }
    async getAllOrders() { 
        return await this.Order.find({}).toArray();  
    }
    async getUserOrder(username){
        return await this.Order.find(
            {"username": username},
        ).toArray()
    }
    async getSuccessOrder(){
        return await this.Order.find(
            {"status": "Đã mua hàng thành công"},
        ).toArray()
    }
    async create(payload){
        const order = this.extractOderData(payload);
        const result = await this.Order.insertOne(order);
        return result.insertedId;
    };
    async update(id,payload){
        const order = this.extractOderData(payload);
        const result = await this.Order.findOneAndUpdate(
            {_id:id},
            {$set: order},
            { returnDocument: "after" }
        );
        return result;
    }
    async findById(id)
    {
        const result = await this.Order.findOne(
            {_id:id},
        )
        return result;
    }
}
module.exports = OrderService;