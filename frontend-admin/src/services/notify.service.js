import createApiClient from "./api.service";
class NotifyService {
    constructor(baseUrl = "/api/datas/") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/notify")).data;
    }
    async create(data) {
        return (await this.api.post("/notify", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/notify")).data;
    }
}

export default new NotifyService()