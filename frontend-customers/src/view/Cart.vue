<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h3 class="text-center mt-3 border border-2 border-primary py-2 rounded">Giỏ hàng của bạn</h3>
    <div v-if="carts.length == 0" class="container text-center fs-3 pt-4 mt-auto">
        <p>Giỏ hàng của bạn không có gì cả!</p>
        <p>Mua hàng ngay nào!</p>
        <button class="btn btn-sm btn-outline-primary"><router-link class="nav-link fs-3"
                :to="{ name: 'homeBook' }">Trang
                chủ</router-link></button>
    </div>
    <div v-else>
        <table id="myTable" class="table table-hover table-responsive w-75 mx-auto">
            <thead>
                <tr>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Tên sách</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tổng cộng</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <CartCard v-for="cart in carts" :key="cart.username" :cart="cart" :user="user"
                    @cart:change="updateCart" />
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">Tổng cộng</td>
                    <td class="fw-bold">{{ getTotal }} VNĐ</td>
                    <div>
                        <td v-if="user">
                            <div v-if="!soldOut">
                                <router-link :to="{ name: 'orderconfirm', params: { bookId: '0' } }" class="nav-link">
                                    <button class="btn btn-sm btn-primary">Mua hàng</button>
                                </router-link>
                            </div>
                            <div v-else>
                                <button disabled class="btn btn-sm btn-secondary">Hết hàng</button>
                            </div>
                        </td>
                        <td v-else>
                            <router-link :to="{ name: 'loginPage' }" class="nav-link">
                                <button class="btn btn-sm btn-secondary">Đăng nhập</button>
                            </router-link>
                        </td>
                    </div>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
<script>
import CartService from "@/services/cart.service";
import CartCard from "@/components/CartCard.vue";
import bookService from "@/services/book.service";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
export default {
    data() {
        return {
            carts: [],
            total: 0,
            user: "",
            soldOut: 0,
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    components: {
        CartCard,
        AppHeader
    },
    computed: {
        getTotal() {
            return this.total.toLocaleString('vi-VN');
        }
    },
    methods: {
        async getCart() {
            this.user = sessionStorage.getItem("userName");
            if (this.user) {
                this.carts = await CartService.get(this.user);
            }
            else {
                this.carts = await CartService.get(sessionStorage.getItem("guest"));
            }
            this.total = 0;
            this.carts.forEach(cart => {
                let bookPrice = cart.quantity * cart.price;
                this.total += bookPrice;
            });
            this.checkSoldOut();
        },
        updateCart() {
            this.getCart();
            this.getCartCount();
        },
        async checkSoldOut() {
            for (let i = 0; i < this.carts.length; i++) {
                const book = await bookService.get(this.carts[i].bookId);
                if (book.soquyen == 0) {
                    this.soldOut = 1;
                }
            }
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
            this.getCart();
            this.isLoggedIn();
            this.getCartCount();
            this.getNotifyCount();
        }
    },
    created() {
        this.getData();
    }
}
</script>