<template>
    <div>
        <h1>Quản lý đơn hàng</h1>
        <hr>
        <div>
            <div class="mb-3">
                <button @click="allOrder" class="btn btn-sm btn-outline-dark me-2">Tất cả đơn hàng</button>
                <button @click="filerOrder" class="btn btn-sm btn-outline-secondary me-2">Đơn hàng chưa xác
                    nhận</button>
                <button @click="confirmed" class="btn btn-sm btn-outline-warning me-2">Đơn hàng đã xác nhận</button>
                <button @click="delivering" class="btn btn-sm btn-outline-info me-2">Đơn hàng đang giao</button>
                <button @click="success" class="btn btn-sm btn-outline-success">Đơn hàng đã thanh toán</button>
            </div>
            <ul class="list-group mb-2">
                <li v-for="item in ordersNotConfirm" :key="item._id" class="list-group-item">
                    <div class="d-flex justify-content-between">
                        Mã đơn hàng: {{ item._id }} - Ngày đặt: {{ item.date }} - Tổng tiền: {{ item.total }}
                        <i v-if="isOrderDetailVisible(item._id)" class="fa-solid fa-chevron-up mt-1"
                            @click="toggleOrderDetail(item._id)"></i>
                        <i v-else class="fa-solid fa-chevron-down mt-1" @click="toggleOrderDetail(item._id)"></i>
                    </div>
                    <div v-if="isOrderDetailVisible(item._id)">
                        <hr>
                        <ul class="list-group list-group-flush">
                            <OrderBookCard :books="item.bookId" :index="index" />
                        </ul>
                    </div>

                    <button v-if="item.status == 'Chờ xác nhận'" @click="confirmOrder(item._id, 'Đã xác nhận')"
                        class="btn btn-sm btn-outline-secondary">Xác nhận đơn hàng</button>
                    <button v-else-if="item.status == 'Đã xác nhận'" @click="confirmOrder(item._id, 'Đang giao hàng')"
                        class="btn btn-sm btn-outline-secondary">Giao hàng</button>
                    <p v-else class="text-success">{{ item.status }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import OrderService from "@/services/order.service";
import OrderBookCard from "@/components/OrderBookCard.vue";
export default {
    data() {
        return {
            orders: [],
            ordersNotConfirm: [],
            orderDetailsVisibility: {},
        }
    },
    components: {
        OrderBookCard,
    },
    methods: {
        async getOrders() {
            this.orders = await OrderService.getAll();
            this.filerOrder();

        },
        allOrder() {
            this.ordersNotConfirm = this.orders;
        },
        filerOrder() {
            this.ordersNotConfirm = this.orders.filter(item => item.status == 'Chờ xác nhận');
        },
        confirmed() {
            this.ordersNotConfirm = this.orders.filter(item => item.status == 'Đã xác nhận');
        },
        delivering() {
            this.ordersNotConfirm = this.orders.filter(item => item.status == 'Đang giao hàng');
        },
        success() {
            this.ordersNotConfirm = this.orders.filter(item => item.status == 'Đã mua hàng thành công');
        },
        async confirmOrder(id, status) {
            try {
                const order = {
                    _id: id,
                    status: status
                }
                if (confirm("Bạn có muốn xác nhận đơn hàng này không?")) {
                    await OrderService.update(id, order);
                }
                this.refresh();
            } catch (error) {
                console.log(error)
            }

        },
        toggleOrderDetail(orderId) {
            this.orderDetailsVisibility[orderId] = !this.orderDetailsVisibility[orderId];
        },
        isOrderDetailVisible(orderId) {
            return this.orderDetailsVisibility[orderId];
        },
        refresh() {
            this.getOrders();
        }
    },
    created() {
        this.refresh();
    }
}
</script>