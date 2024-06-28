import createApiClient from "./api.service";
class CardService {
    constructor(baseUrl = "/api/datas") {
        this.api = createApiClient(baseUrl);
    }
    async checkCard(data) {
        return (await this.api.post("/card",data)).data;
    }
    async findAll(id,cardType) {
        return (await this.api.get(`/card/${id}?cardType=` + cardType)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/card/${id}`)).data;
    }
    async deleteAll(id,data){
        return (await this.api.post("/card")).data;
    }
}
export default new CardService()