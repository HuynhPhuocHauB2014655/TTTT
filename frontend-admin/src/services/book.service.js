import createApiClient from "./api.service";
class BookService {
    constructor(baseUrl = "/api/datas") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/find")).data;
    }
    async create(data) {
        return (await this.api.post("/admin", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/admin")).data;
    }
    async get(id) {
        return (await this.api.get(`/find/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/admin/${id}`, data)).data;

    }
    async delete(id) {
        return (await this.api.delete(`/admin/${id}`)).data;
    }
}
export default new BookService()