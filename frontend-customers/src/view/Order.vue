<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h3 class="text-center mt-3">Đơn hàng của bạn</h3>
    <hr>
    <div class="mb-2">
        <button class="btn btn-sm btn-outline-secondary me-1" @click="changeType(1)">Mới đến cũ</button>
        <button class="btn btn-sm btn-outline-secondary" @click="changeType(0)">Cũ đến mới</button>
    </div>
    <div>
        <ul class="list-group mb-2">
            <li v-for="(item, index) in sortOrder" :key="item._id" class="list-group-item">
                <div class="d-flex justify-content-between">
                    <div>
                        Mã đơn hàng: {{ item._id }} - Ngày đặt: {{ item.date }} - Tổng tiền: {{ item.total }}
                    </div>
                    <div>
                        <span v-if="item.status == 'Đang giao hàng'" class="me-3">
                            {{ item.status }}
                            <button class="btn btn-sm btn-success" @click="confirmPaymented(index)">Đã nhận
                                hàng</button>
                        </span>
                        <span v-else class="me-3">{{ item.status }}</span>
                        <i v-if="isOrderDetailVisible(item._id)" class="fa-solid fa-chevron-up mt-1"
                            @click="toggleOrderDetail(item._id)"></i>
                        <i v-else class="fa-solid fa-chevron-down mt-1" @click="toggleOrderDetail(item._id)"></i>
                    </div>
                </div>
                <div v-if="isOrderDetailVisible(item._id)">
                    <hr>
                    <ul class="list-group list-group-flush">
                        <OrderBookCard :books="item.bookId" :index="index" :orderId="item._id" :status="item.status" @order:change="updateOrder"/>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>
<style>
.fa-chevron-down,
.fa-chevron-up:hover {
    cursor: pointer;
}
</style>
<script>
import OrderService from "@/services/order.service.js";
import OrderBookCard from "@/components/OrderBookCard.vue";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import CartService from "@/services/cart.service";
export default {
    data() {
        return {
            orders: [],
            username: "",
            show: false,
            idShow: "",
            typeSort: 1,
            orderDetailsVisibility: {},
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    components: {
        OrderBookCard,
        AppHeader
    },
    computed: {
        sortOrder() {
            if (this.typeSort == 1) {
                return this.orders.sort((a, b) => b._id.localeCompare(a._id));
            }
            else {
                return this.orders.sort((a, b) => a._id.localeCompare(b._id));
            }
        }
    },
    methods: {
        async getOrder() {
            try {
                this.userName = sessionStorage.getItem("userName");
                this.orders = await OrderService.getUserOrder(this.userName);
                this.orders.forEach(order => {
                    this.$set(this.orderDetailsVisibility, order._id, false);
                });
            }
            catch (error) {
                console.log(error);
            }
        },
        updateOrder(){
            this.getOrder();
        },
        changeType(type) {
            this.typeSort = type;
        },
        toggleOrderDetail(orderId) {
            this.orderDetailsVisibility[orderId] = !this.orderDetailsVisibility[orderId];
        },
        isOrderDetailVisible(orderId) {
            return this.orderDetailsVisibility[orderId];
        },
        async confirmPaymented(index) {
            if (confirm("Bạn có chắc chắn với hành động này không?")) {
                const updateOrder = {
                    id: this.sortOrder[index]._id,
                    status: "Đã mua hàng thành công",
                }
                try {
                    const result = await OrderService.update(updateOrder.id, updateOrder);
                    alert('Cập nhật trạng thái thành công!');
                    this.getOrder();
                }
                catch (error) {
                    console.log(error);
                }
            }
            console.log(this.sortOrder[index]);
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
            this.getOrder();
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