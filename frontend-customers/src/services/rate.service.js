import createApiClient from "./api.service";
class RateService{
    constructor(baseUrl = "/api/datas/") {
        this.api = createApiClient(baseUrl);
    }
    async create(data){
        return (await this.api.post("/rate", data)).data;
    }
    async getByBookId(bookId){
        return (await this.api.get(`/rate/find/${bookId}`)).data;
    }
    async findOne(data){
        return (await this.api.put("/rate",data)).data; 
    }
    async update(id,data){
        return (await this.api.put(`/rate/${id}`,data)).data; 
    }
    async getAverageRating(id){
        return (await this.api.get("/rate?id=" + id)).data;
    }
}
export default new RateService();