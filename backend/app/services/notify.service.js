const { ObjectId } = require("mongodb");
class NotifyService{
    constructor(client) {
        this.Notify = client.db().collection("notification");
    }

    extractNotifyData(payload) {
        const notify = {
            title: payload.title,
            content: payload.content,
            username: payload.username,
        };
        Object.keys(notify).forEach(
            (key) => notify[key] === undefined && delete notify[key]
        );
        return notify;
    }

    async create(payload){
        const  notify = this.extractNotifyData(payload);
        const rs = await this.Notify.insertOne(notify);
        return rs;
    }

    async find(fitter) {
        const rs = await this.Notify.find(fitter);
        return await rs.toArray();
    }

    async delete(id){
        const rs = await this.Notify.findOneAndDelete({
             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return rs;
    }

    async deleteAll() {
        const rs = await this.Notify.deleteMany({});
        return rs;
    }
}

module.exports = NotifyService;