const { ObjectId, ReturnDocument } = require("mongodb");
class SupportService{
    constructor(client) {
        this.Sup = client.db().collection("support");
    }
    extractSupData(data){
        let request={
            userName: data.userName,
            content: data.content,
            response: data.response,
            status: data.status,
        };
        Object.keys(request).forEach(
            (key) => request[key] === undefined && delete request[key]
        );
        return request;
    }
    async create(payload){
        const request = this.extractSupData(payload);
        const result = await this.Sup.insertOne(request);
        return result.insertedId;
    }
    async update(id,payload){
        const request = this.extractSupData(payload);
        const result = await this.Sup.findOneAndUpdate(
            {_id : ObjectId.isValid(id) ? new ObjectId(id) : null},
            {$set:request},
            { returnDocument: "after", upsert: true }
        )
        return result;
    }
    async find(userName){
        const result = await this.Sup.find({
            userName: userName,
        }).toArray();
        return result;
    }
    async findAll(){
        const result = await this.Sup.find({
        }).toArray();
        return result;
    }
    async findById(id){
        const result = await this.Sup.findOne({
            _id : ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
        return result;
    }
    async delete(id){
        const result = await this.Sup.findOneAndDelete({
            _id : ObjectId.isValid(id) ? new ObjectId(id) : null,
        })
        return result;
    }
    async deleteAll(){
        const result = await this.Sup.deleteMany({})
        return result;
    }
}
module.exports = SupportService;