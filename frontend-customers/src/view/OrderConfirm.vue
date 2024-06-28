<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <div v-if="!success">
        <h2 class="text-center mt-3">Xác nhận đơn hàng</h2>
        <hr>
        <table class="table w-50 text-center mx-auto">
            <thead>
                <tr>
                    <th colspan="2">Thông tin khách hàng: </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Họ và tên:</td>
                    <td>{{ user.hoten }}</td>
                </tr>
                <tr>
                    <td>Địa chỉ:</td>
                    <td>{{ user.diachi }}</td>
                </tr>
                <tr>
                    <td>Số điện thoại:</td>
                    <td>{{ user.sdt }}</td>
                </tr>
            </tbody>
        </table>
        <table class="table w-75 mx-auto">
            <thead>
                <tr>
                    <th colspan="6" class="text-center">Thông tin sản phẩm: </th>
                </tr>
                <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Giá tiền</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                <OrderConfirmCard v-if="bookId == 0" v-for="(item, index) in carts" :key="item.bookId" :order="item"
                    :index="index" />
                <OrderConfirmCard v-else :order="book" :index="0" :quantity="quantity" />
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4"></td>
                    <td><b>Tổng giá trị đơn hàng:</b></td>
                    <td>{{ total }} VNĐ</td>
                </tr>
            </tfoot>
        </table>
        <div class="mx-auto w-75 bg-light p-2 mb-2">
            <p>Phương thức thanh toán</p>
            <select v-model="paymentMethod" id="paymentMethod" class="form-select mb-2">
                <option value="0" selected>Thanh toán khi nhận hàng</option>
                <option value="2">Thẻ ngân hàng nội địa</option>
                <option value="1">Thẻ Visa/Mastercard</option>
            </select>
            <div v-if="paymentMethod == 0" class="d-flex justify-content-center mt-2">
                <button class="btn btn-primary" @click="addOrder">
                    Đặt hàng
                </button>
            </div>
            <div v-if="paymentMethod == 2" class="d-flex justify-content-around">
                <li class="list-group-item border border-2 rounded p-1">
                    <a href="#" @click.prevent="bankPay('CTG')"><img src="../assets/vietinbank.jpg" width="70"
                            height="70"></a>
                </li>
                <li class="list-group-item border border-2 rounded p-1">
                    <a href="#" @click.prevent="bankPay('VARB')"><img src="../assets/Agribank.jpg" width="70"
                            height="70"></a>
                </li>
                <li class="list-group-item border border-2 rounded p-1">
                    <a href="#" @click.prevent="bankPay('BIDV')"><img src="../assets/BIDV.png" width="70"
                            height="70"></a>
                </li>
                <li class="list-group-item border border-2 rounded p-1">
                    <a href="#" @click.prevent="bankPay('VCB')"><img src="../assets/VCB.jpg" width="70" height="70"></a>
                </li>
            </div>
            <div v-if="paymentMethod == 1">
                Thẻ Visa/Mastercard của bạn
                <div>
                    <div class="list-group list-group-horizontal">
                        <div v-if="visaCards.length > 0">
                            <div v-for="card in visaCards" :key="card._id" class="border px-4 py-2 me-1 list-group-item"
                                @click="chooseCard(card._id)">
                                <div class="mb-2">
                                    **** **** **** {{ card.cardNum.slice(-4) }}
                                    <button class="btn btn-sm btn-outline-secondary ms-3"
                                        @click="deleteCard(card._id)">Xóa</button>
                                </div>
                                <form v-if="showCvv == card._id" class="row">
                                    <input type="text" class="form-control w-50 col" required v-model="visaCard.cvv"
                                        placeholder="CVV" />
                                    <button class="btn btn-sm btn-outline-secondary ms-2 col-2" type="submit"
                                        @click.prevent="checkCardInfo(card)">OK</button>
                                </form>
                            </div>
                        </div>
                        <div class="border px-4 py-2 list-group-item">
                            <button class="btn btn-sm btn-outline-success mt-auto" @click="addVisaCard"><i
                                    class="fa-solid fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-50 bg-white px-5 py-4 position-absolute top-50 start-50 translate-middle
        z-3 border rounded border-3 border-dark shadow-lg" v-if="showCardModal == 1">
            <button class="position-absolute top-0 end-0 btn" @click="closeCardModal"><i
                    class="fa-solid fa-x"></i></button>
            <div class="text-center fs-4 mb-4">
                Nhập thông tin thẻ
            </div>
            <Form @submit="checkCardInfo(null)" :validation-schema="bankFormSchema">
                <div class="form-floating mb-2">
                    <input type="text" disabled class="form-control" id="bank" v-model="bank" placeholder="Ngân hàng" />
                    <label for="bank">Ngân hàng</label>
                </div>
                <div class="form-floating mb-2">
                    <Field type="text" name="cardNumber" v-model="bankCard.cardNum" class="form-control"
                        placeholder="Số thẻ" />
                    <label for="cardNumber">Số thẻ</label>
                    <ErrorMessage name="cardNumber" class="error-feedback" />
                </div>
                <div class="form-floating mb-2">
                    <Field type="text" name="cardName" class="form-control" v-model="bankCard.cardName" id="cardName"
                        placeholder="Tên chủ thẻ" />
                    <label for="cardName">Tên chủ thẻ</label>
                    <ErrorMessage name="cardName" class="error-feedback" />
                </div>
                <div class="d-flex">
                    <label for="cardName" class="form-label mt-3">Ngày hiệu lực:</label>
                    <div class="d-flex w-50 ms-2 ">
                        <div class="form-floating">
                            <Field type="text" name="validM" v-model="bankCard.validM" class="form-control" id="MM"
                                placeholder="MM" />
                            <label for="MM">MM</label>
                            <ErrorMessage name="validM" class="error-feedback" />
                        </div>
                        <div class="fs-2 mx-1">/</div>
                        <div class="form-floating">
                            <Field type="text" name="validY" v-model="bankCard.validY" class="form-control" id="YY"
                                placeholder="YY" />
                            <label for="YY">YY</label>
                            <ErrorMessage name="validY" class="error-feedback" />
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-3">
                    <button class="btn btn-primary">Thanh toán</button>
                </div>
            </Form>
        </div>
        <div class="w-50 bg-white px-5 py-4 position-absolute top-50 start-50 translate-middle
        z-3 border rounded border-3 border-dark shadow-lg" v-if="showCardModal == 2">
            <button class="position-absolute top-0 end-0 btn" @click="closeCardModal"><i
                    class="fa-solid fa-x"></i></button>
            <div class="text-center fs-4 mb-4">
                Nhập thông tin thẻ
            </div>
            <Form @submit="checkCardInfo(null)" :validation-schema="visaFormSchema">
                <div class="form-floating mb-2">
                    <Field type="text" name="cardVisaNumber" v-model="visaCard.cardNum" class="form-control"
                        placeholder="Số thẻ" />
                    <label for="cardVisaNumber">Số thẻ</label>
                    <ErrorMessage name="cardVisaNumber" class="error-feedback" />
                </div>
                <div class="form-floating mb-2">
                    <Field type="text" name="cardVisaName" class="form-control" v-model="visaCard.cardName"
                        id="cardName" placeholder="Tên chủ thẻ" />
                    <label for="cardVisaName">Tên chủ thẻ</label>
                    <ErrorMessage name="cardVisaName" class="error-feedback" />
                </div>
                <div class="row">
                    <div class="col-8 my-auto">
                        <div class="d-flex">
                            <label for="cardName" class="form-label my-auto me-3">Ngày hết hạn:</label>
                            <div class="d-flex w-50">
                                <div class="form-floating">
                                    <Field type="text" name="expiryM" v-model="visaCard.expiryM" class="form-control"
                                        id="MM" placeholder="MM" />
                                    <label for="MM">MM</label>
                                    <ErrorMessage name="expiryM" class="error-feedback" />
                                </div>
                                <div class="fs-2 mx-1">/</div>
                                <div class="form-floating">
                                    <Field type="text" name="expiryY" v-model="visaCard.expiryY" class="form-control"
                                        id="YY" placeholder="YY" />
                                    <label for="YY">YY</label>
                                    <ErrorMessage name="expiryY" class="error-feedback" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating">
                            <Field type="text" v-model="visaCard.cvv" class="form-control" id="cvv" name="cvv"
                                placeholder="CVV" />
                            <label for="cvv">CVV</label>
                            <ErrorMessage name="cvv" class="error-feedback" />
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-3">
                    <button class="btn btn-primary">Thanh toán</button>
                </div>
            </Form>
        </div>
    </div>
    <div v-else class="text-center m-auto border border-2 border-primary rounded p-3">
        <h3>Đã đặt hàng thành công!</h3>
        <router-link :to="{ name: 'order' }"><button class="btn btn-sm btn-primary mt-2">Đơn hàng</button></router-link>
    </div>
</template>
<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.error-feedback {
    color: #dc3545 !important;
}
</style>
<script>
import CartService from "@/services/cart.service";
import CardService from "@/services/card.service";
import OrderService from "@/services/order.service";
import CustomerService from "@/services/customer.service";
import OrderConfirmCard from "@/components/OrderConfirmCard.vue";
import BookService from "@/services/book.service";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    props: {
        bookId: { type: String, default: '' }
    },
    data() {
        const bankFormSchema = yup.object().shape({
            cardNumber: yup
                .string()
                .required("Không được bỏ trống.")
                .min(16, "Số thẻ không đúng định dạng.")
                .max(16, "Số thẻ không đúng định dạng."),
            cardName: yup
                .string()
                .required("Không được bỏ trống."),
            validM: yup
                .string()
                .required("Không được bỏ trống.")
                .min(2, "Phải có 2 ký tự")
                .max(2, "Phải có 2 ký tự"),
            validY: yup
                .string()
                .required("Không được bỏ trống.")
                .min(2, "Phải có 2 ký tự")
                .max(2, "Phải có 2 ký tự"),
        });
        const visaFormSchema = yup.object().shape({
            cardVisaNumber: yup
                .string()
                .required("Không được bỏ trống.")
                .min(16, "Số thẻ không đúng định dạng.")
                .max(16, "Số thẻ không đúng định dạng."),
            cardVisaName: yup
                .string()
                .required("Không được bỏ trống."),
            expiryM: yup
                .string()
                .required("Không được bỏ trống.")
                .min(2, "Phải có 2 ký tự")
                .max(2, "Phải có 2 ký tự"),
            expiryY: yup
                .string()
                .required("Không được bỏ trống.")
                .min(2, "Phải có 2 ký tự")
                .max(2, "Phải có 2 ký tự"),
            cvv: yup
                .string()
                .required("Không được bỏ trống."),
        });
        return {
            showCvv: "",
            visaFormSchema,
            bankFormSchema,
            visaCards: [],
            bankCards: [],
            carts: [],
            user: {},
            total: 0,
            success: false,
            book: {},
            quantity: 0,
            paymentMethod: 0,
            showCardModal: 0,
            bank: "",
            bankCard: {
                userName: sessionStorage.getItem("userName"),
                cardType: 2,
                bank: "",
                cardNum: null,
                cardName: "",
                validM: null,
                validY: null,
            },
            visaCard: {
                userName: sessionStorage.getItem("userName"),
                cardType: 1,
                cardNum: null,
                cardName: "",
                expiryM: null,
                expiryY: null,
                cvv: null,
            },
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    components:
    {
        OrderConfirmCard,
        Form,
        Field,
        ErrorMessage,
        AppHeader
    },
    methods:
    {
        async getinfo() {
            this.user = await CustomerService.get(sessionStorage.getItem("userName"));
            this.carts = await CartService.get(this.user._id);
            this.carts.forEach(item => {
                this.total += item.price * item.quantity;
            });
        },
        async getCards() {
            this.visaCards = await CardService.findAll(sessionStorage.getItem("userName"), 1);
            this.bankCards = await CardService.findAll(sessionStorage.getItem("userName"), 2);
        },
        async getBook() {
            try {
                this.user = await CustomerService.get(sessionStorage.getItem("userName"));
                this.book = await BookService.get(this.bookId);
                this.quantity = sessionStorage.getItem("quantity");
                sessionStorage.removeItem("quantity");
                if (!this.quantity) {
                    this.quantity = 1;
                }
                this.total = this.book.gia * this.quantity;
            } catch (error) {
                console.log(error);
            }
        },
        async addOrder() {
            var order;
            if (this.bookId == 0) {
                order = {
                    username: this.user._id,
                    bookId: this.carts.map((item) => ({
                        bookId: item.bookId,
                        price: item.price,
                        quantity: item.quantity,
                        hinh: item.hinh,
                        tensach: item.tensach,
                    })),
                    total: this.total,
                    date: new Date().toISOString().substr(0, 10),
                    rating: 0,
                };
                order.bookId.forEach((item) => {
                    this.quantityManager(item);
                })
            }
            else {
                order = {
                    username: this.user._id,
                    bookId: [{
                        bookId: this.book._id,
                        price: this.book.gia,
                        quantity: this.quantity,
                        hinh: this.book.hinh,
                        tensach: this.book.tensach,
                    }],
                    total: this.total,
                    date: new Date().toISOString().substr(0, 10),
                    rating: 0,
                };
                this.quantityManager(order.bookId[0]);
            }
            try {
                await OrderService.create(order);
                this.success = true;
                await CartService.deleteAll(this.user._id);
            } catch (error) {
                alert("Thêm thất bại!");
            }
        },
        async quantityManager(book) {
            var orderBook = await BookService.get(book.bookId);
            console.log(orderBook);
            if (orderBook) {
                orderBook.soquyen -= book.quantity;
                if (orderBook.soquyen < 0) {
                    orderBook.soquyen = 0;
                    alert('Sách bạn muốn mua đã bán hết!');
                    this.$router.push({ name: "homeBook" });
                }
                try {
                    await BookService.update(orderBook._id, orderBook);
                }
                catch (error) {
                    alert("Có lỗi xảy ra trong quá trình tạo đơn hàng");
                }
            }
        },
        chooseCard(id) {
            this.showCvv = id;
        },
        bankPay(bank) {
            this.showCardModal = 1;
            switch (bank) {
                case "CTG":
                    this.bank = "Vietinbank";
                    this.bankCard.bank = "CTG";
                    break;
                case "VARB":
                    this.bank = "Agribank";
                    this.bankCard.bank = "VARB";
                    break;
                case "BIDV":
                    this.bank = "BIDV";
                    this.bankCard.bank = "BIDV";
                    break;
                case "VCB":
                    this.bank = "Vietcombank";
                    this.bankCard.bank = "VCB";
                    break;
                default:
                    break;
            }
        },
        closeCardModal() {
            this.showCardModal = 0;
            this.resetBankCard();
            if (this.paymentMethod == 1) {
                this.showCardModal = 0;
                this.resetVisaCard();
            }
        },
        resetBankCard() {
            this.bankCard.bank = "";
            this.bankCard.cardNum = null;
            this.bankCard.cardName = "";
            this.bankCard.validM = null;
            this.bankCard.validY = null;
        },
        resetVisaCard() {
            this.visaCard.cardNum = null;
            this.visaCard.cardName = "";
            this.visaCard.expiryM = null;
            this.visaCard.expiryY = null;
            this.visaCard.cvv = null;
        },
        async checkCardInfo(card) {
            var result;
            if (!card) {
                if (this.paymentMethod == 2) {
                    result = await CardService.checkCard(this.bankCard);
                }
                else {
                    result = await CardService.checkCard(this.visaCard);
                }
            }
            else {
                this.visaCard.cardName = card.cardName;
                this.visaCard.cardNum = card.cardNum;
                this.visaCard.expiryM = card.expiryM;
                this.visaCard.expiryY = card.expiryY;
                result = await CardService.checkCard(this.visaCard);
            }
            if (result) {
                this.addOrder();
                this.closeCardModal();
            }
            else {
                alert("Thông tin thẻ không chính xác!");
            }
        },
        addVisaCard() {
            this.showCardModal = 2;
        },
        isLoggedIn() {
            if (sessionStorage.getItem("userName")) {
                this.logined = 1;
            }
        },
        async getCartCount() {
            if (this.logined) {
                const cart = await CartService.get(sessionStorage.getItem("userName"));
                this.cartCount = cart.length;
            }
            else {
                const cart = await CartService.get(sessionStorage.getItem("guest"));
                this.cartCount = cart.length;
            }
        },
        async getNotifyCount() {
            if (this.logined) {
                const notify = await NotifyService.getNotify(sessionStorage.getItem("userName"));
                this.notifyCount = notify.length;
            }
            else {

                this.notifyCount = 0;
            }
        },
        getData() {
            this.getCards();
            this.isLoggedIn();
            this.getCartCount();
            this.getNotifyCount();
        }
    },
    created() {
        this.getData();
        if (this.bookId != 0) {
            this.getBook();
        }
        else {
            this.getinfo();
        }
    }
}
</script>