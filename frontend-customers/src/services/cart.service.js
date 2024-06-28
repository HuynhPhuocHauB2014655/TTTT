import createApiClient from "./api.service";
class CartService {
    constructor(baseUrl = "/api/datas") {
        this.api = createApiClient(baseUrl);
    }
    async create(username,data) {
        return (await this.api.post(`/cart/${username}`,data)).data;
    }
    async get(username) {
        return (await this.api.get(`/cart/${username}`)).data;
    }
    async update(username,data) {
        return (await this.api.put(`/cart/${username}`,data)).data;
    }
    async deleteAll(username) {
        return (await this.api.delete(`/cart/${username}`)).data;
    }
    async delete(username,bookId) {
        return (await this.api.delete(`/cart/${username}/${bookId}`)).data;
    }
}
export default new CartService()