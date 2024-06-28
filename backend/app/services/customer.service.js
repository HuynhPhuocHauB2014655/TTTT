const CryptoJS = require('crypto-js');
const ApiError = require("../api-error");
class CustomerService {
    constructor(client) {
        this.Customer = client.db().collection("customers");
    }

    extractCustomerData(payload) {
        const customer = {
            _id: payload.username.toLowerCase(),
            password: payload.password,
            hoten: payload.name,
            diachi: payload.address,
            sdt: payload.phone,

        };
        Object.keys(customer).forEach(
            (key) => customer[key] === undefined && delete customer[key]
        );
        return customer;
    }
    extractLoginData(payload) {
        const user = {
            _id: payload.username.toLowerCase(),
            password: payload.password,
        };
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }
    async create(payload) {
            const newUsername = await this.Customer.findOne({_id :payload.username});
            if(newUsername) {
                return null;
            }
            else {
                const customer = this.extractCustomerData(payload);
                customer.password = CryptoJS.AES.encrypt(customer.password, "secretKey655679", { iv: "secretKey655679IV" }).toString();
                const result = await this.Customer.insertOne(
                    customer,
                    { returnDocument: "after", upsert: true }
                );
                return result;
            }
    }

    async login(username,password) {
        const user = await this.Customer.findOne({_id:username});
        const decrypted = CryptoJS.AES.decrypt(user.password, "secretKey655679", { iv: "secretKey655679IV" }).toString(CryptoJS.enc.Utf8);
        if(decrypted == password){
            return user;
        }
        return null;
    }
    async update(id,payload) {
        const user = this.extractCustomerData(payload);
        const  filter = {
            _id: id,
        };
        if(user.password)
        {
            user.password = CryptoJS.AES.encrypt(user.password, "secretKey655679", { iv: "secretKey655679IV" }).toString();
        }
        const result = await this.Customer.findOneAndUpdate(
            filter,
            {$set:user})
        return result;
    }
    async find(filter) {
        const cursor = await this.Customer.find(filter);
        return await cursor.toArray();
    }
    async findOne(id){
        const result = await this.Customer.findOne({_id:id});
        return result;
    }
    async decryptPassword(id){
        const customers = await this.Customer.findOne({_id:id});
        customers.password = CryptoJS.AES.decrypt(customers.password, "secretKey655679", { iv: "secretKey655679IV" }).toString(CryptoJS.enc.Utf8);
        return customers.password;
    }
}
module.exports = CustomerService;
