    const ApiError = require("../api-error");
const { ObjectId } = require("mongodb");
class CardService {
    constructor(client) {
        this.Card = client.db().collection("card");
    }
    getVisaCards() {
        const cards = [
            {
                id: "c1",
                cardType: 1,
                cardNum: "4456530000001005",
                cardName: "HUYNH PHUOC HAU",
                expiryM: "12",
                expiryY: '30',
                cvv: "123",
            },
            {
                id: "c2",
                cardType: 1,
                cardNum: "4456530000001096",
                cardName: "NGUYEN THANH NHAN",
                expiryM: "12",
                expiryY: "30",
                cvv: "123",
            },
            {
                id: "c3",
                cardType: 1,
                cardNum: "5200000000001005",
                cardName: "NGUYEN THANH TIN",
                expiryM: "12",
                expiryY: "30",
                cvv: "123",
            },
            {
                id: "c4",
                cardType: 1,
                cardNum: "5200000000001096",
                cardName: "TRAN TRONG BANG",
                expiryM: "12",
                expiryY: "30",
                cvv: "123",
            },
        ]
        return cards;
    }
    getBankCards() {
        const cards = [
            {
                id: "c1",
                cardType: 2,
                bank: "BIDV",
                cardNum: "9704194841945510",
                cardName: "HUYNH PHUOC HAU",
                validM: "07",
                validY: "15",              
            },
            {
                id: "c2",
                cardType: 2,
                bank: "VCB",
                cardNum: "9704194841945511",
                cardName: "NGUYEN THANH NHAN",
                validM: "07",
                validY: "15",
            },
            {
                id: "c3",
                cardType: 2,
                bank: "VARB",
                cardNum: "9704194841945513",
                cardName: "NGUYEN THANH TIN",
                validM: "07",
                validY: "15",                
            },
            {
                id: "c4",
                cardType: 2,
                bank: "CTG",
                cardNum: "9704193370791314",
                cardName: "TRAN TRONG BANG",
                validM: "07",
                validY: "15",              
            },
        ]
        return cards;
    }
    exstractCardData(payload) {
        const card = {
            userName: payload.userName,
            cardNum: payload.cardNum,
            cardType: payload.cardType,
            cardName: payload.cardName,
            bank: payload.bank,
            expiryM: payload.expiryM,
            expiryY: payload.expiryY,
            validM: payload.validM,
            validY: payload.validY,
        };
        Object.keys(card).forEach(
            (key) => card[key] === undefined && delete card[key]
        );
        return card;
    }
    async create(payload) {
        let newCard = this.exstractCardData(payload);
        const result = await this.Card.insertOne(
            newCard,
            { returnDocument: "after" },
        )
        return result;
    }
    checkCard(payload) {
        if (payload.cardType == 1) {
            const visaCards = this.getVisaCards();
            for (let i in visaCards) {
                if (
                    visaCards[i].cardNum == payload.cardNum
                    && visaCards[i].cardName == payload.cardName
                    && visaCards[i].expiryM == payload.expiryM
                    && visaCards[i].expiryY == payload.expiryY
                    && visaCards[i].cvv == payload.cvv) {
                    return true;
                };
            };
            return false;
        } else {
            const bankCards = this.getBankCards();
            for (let j in bankCards) {
                if (bankCards[j].cardNum == payload.cardNum
                    && bankCards[j].bank == payload.bank
                    && bankCards[j].cardName == payload.cardName
                    && bankCards[j].validM == payload.validM
                    && bankCards[j].validY == payload.validY) {
                    return true;
                }
            };
            return false;
        }
    }
    async findByCardNum(cardNum) {
        const card = await this.Card.findOne(
            { cardNum: cardNum }
        );
        return card;
    }
    async findAll(userName,cardType) {
        const result = await this.Card.find(
            {
                userName:userName,
                cardType:parseInt(cardType),
            }
        ).toArray();
        return result;
    }
    async delete(id) {
        return await this.Card.deleteOne(
            {_id: ObjectId.isValid(id) ? new ObjectId(id) : null,}
        );
    }
    async deleteAll() {
        const result = await this.Card.deleteMany({});
        return result.deletedCount;
    }
}
module.exports = CardService;