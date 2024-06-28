import createApiClient from "./api.service";
class SupportService{
    constructor(baseUrl = "/api/datas/") {
        this.api = createApiClient(baseUrl);
    }
    async create(data){
        return (await this.api.post("/support", data)).data;
    }
    async update(data){
        return (await this.api.put("/support", data)).data;
    }
    async findAll(){
        return (await this.api.get("/support")).data;
    }
    async findByUser(userName){
        return (await this.api.get(`/support/${userName}`)).data;
    }
    async findById(id){
        return (await this.api.get(`/support/find/${id}`)).data;
    }
    async delete(id){
        return (await this.api.delete(`/support/${id}`)).data;
    }
    async deleteAll(){
        return (await this.api.delete("/support")).data;
    }
}
export default new SupportService();