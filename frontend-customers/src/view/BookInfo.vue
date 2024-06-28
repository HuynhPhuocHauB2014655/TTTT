<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h3 class="text-center border border-2 border-info py-2 mt-2">Chi tiết Sách</h3>
    <div class="card my-2" style="background: #f7eac3;">
        <div class="row m-2">
            <div class="col-md text-center">
                <img :src="book.hinh" width="400px" class="img-fluid rounded m-2" alt="book-image">
            </div>
            <div class="col-md">
                <div class="card-body">
                    <h3 class="card-title">{{ book.tensach }}</h3>
                    <h4 class="card-title text-danger">Giá: {{ book.gia }}đ</h4>
                    <p class="card-text fs-5">Thể loại: {{ book.theloai }}</p>
                    <p class="card-text fs-5">Số trang: {{ book.sotrang }}</p>
                    <p class="card-text fs-5">Nhà xuất bản: {{ book.nxb }}</p>
                    <p class="card-text fs-5">Số quyển: {{ book.soquyen }}</p>
                    <p class="card-text fs-5">Ngôn ngữ: {{ book.ngonngu }}</p>
                    <div class="d-flex">
                        <input type="number" inputmode="numeric" class="rounded mt-2 me-2 form-control"
                            style="width: 80px; height: 35px;" min="1" v-model="quantity">
                        <button @click="addToCart(book)" class="btn btn-sm btn-success mt-2 me-2">Thêm vào giỏ
                            hàng</button>
                        <button v-if="logined" @click="buyNow()" class="btn btn-sm btn-primary mt-2">Mua ngay</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="my-2 px-2 border border-dark rounded">
            <div class="d-flex justify-content-between">
                <p class="fs-5 fw-bold">Đánh giá:</p>
                <p>{{ rate.length }} đánh giá</p>
            </div>
            <div v-if="check">
                <div v-for="r in rate">
                    <p>Họ tên: {{ r.hoten }}</p>
                    <p>Đánh giá: {{ r.rating }} sao</p>
                    <p style="overflow-wrap: break-word;">Nội dung: {{ r.review }}</p>
                    <hr>
                </div>
            </div>
            <p v-else class="fs-3 text-center"> Sách chưa có đánh giá hay bình luận!</p>
        </div>
</template>

<script>
import BookService from "@/services/book.service";
import CartService from "@/services/cart.service";
import RateService from "@/services/rate.service";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
export default {
    props: {
        bookId: { type: String, required: true }
    },
    components: {
        AppHeader
    },
    data() {
        return {
            book: [],
            rate: [],
            check: false,
            quantity: 1,
            cartItem: {
                bookId: "",
                price: "",
                quantity: 1,
            },
            cartCount:0,
            notifyCount:0,
            logined:0,
        }
    },
    methods: {
        async getBook() {
            try {
                this.book = await BookService.get(this.bookId);
            }
            catch (error) {
                console.log(error);
            }
        },
        async getRate() {
            try {
                this.rate = await RateService.getByBookId(this.bookId);
                this.check = true;
            } catch (error) {
                console.log(error);
            }
        },
        async addToCart(book) {
            const userName = sessionStorage.getItem("userName");
            this.cartItem.bookId = book._id;
            this.cartItem.price = book.gia;
            this.cartItem.hinh = book.hinh;
            this.cartItem.tensach = book.tensach;
            this.cartItem.quantity = this.quantity;
            if (userName) {
                try {
                    const result = await CartService.create(userName, this.cartItem);
                    alert('Thêm vào giỏ hàng thành công!');
                    this.getCartCount();
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                const guest = sessionStorage.getItem("guest");
                const result = await CartService.create(guest, this.cartItem);
                alert('Thêm vào giỏ hàng thành công!');
                location.reload();
            }
        },
        buyNow() {
            sessionStorage.setItem("quantity", this.quantity);
            this.$router.push({ name: 'orderconfirm', params: { bookId: this.book._id } });
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
            this.getBook();
            this.getRate();
            this.isLoggedIn();
            this.getCartCount();
            this.getNotifyCount();
        }
    },
    created() {
        this.check = false;
        this.getData();
    }
}
</script>