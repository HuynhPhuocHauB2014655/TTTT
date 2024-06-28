<template>
    <div>
        <h1 class="text-center">Doanh thu</h1>
        <hr />
        <div class="my-2">
            <button class="btn btn-sm btn-outline-info mx-1" @click="totalAll">Tổng doanh thu</button>
            <button class="btn btn-sm btn-outline-info mx-1" @click="totalType(1)">Doanh thu ngày</button>
            <button class="btn btn-sm btn-outline-info mx-1" @click="totalType(2)">Doanh thu tháng</button>
            <button class="btn btn-sm btn-outline-info mx-1" @click="totalType(3)">Doanh thu năm</button>
            <form v-if="type == 1" class="mt-2">
                <label class="form-label" for="day">Nhập ngày:</label>
                <input class="form-control w-25" type="date" v-model="date" id="day">
                <button class="btn btn-sm btn-primary mt-2" @click.prevent="totalDate()">Tính toán</button>
            </form>
            <form v-if="type == 2" class="mt-2 w-25">
                <div class="d-flex">
                    <input type="number" inputmode="numeric" name="month" class="form-control me-2" id="month" min="1"
                        max="12" v-model="month" placeholder="Tháng" required />
                    <input type="number" inputmode="numeric" name="year" class="form-control" id="year" min="1000"
                        max="3000" v-model="year" placeholder="Năm" required />
                </div>
                <button class="btn btn-sm btn-primary mt-2" @click.prevent="totalMonth()">Tính toán</button>
            </form>
            <form v-if="type == 3" class="mt-2">
                <input type="number" inputmode="numeric" name="year" class="form-control" id="year" min="1000"
                    max="3000" v-model="year" placeholder="Năm" required style="width: 200px;" />
                <button class="btn btn-sm btn-primary mt-2" @click.prevent="totalYear()">Tính toán</button>
            </form>
            <div>
                <p class="h4 mt-3">Tổng doanh thu: {{ total }}</p>
            </div>
        </div>
        <div style="height: 300px; overflow: auto;">
            <ul class="list-group">
                <li v-for="(item, index) in datas2" :key="item._id" class="list-group-item list-group-item-action">
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
                </li>
            </ul>
        </div>
    </div>
</template>
<style>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
<script>
import OrderService from "@/services/order.service";
import OrderBookCard from "@/components/OrderBookCard.vue";
export default {
    components: {
        OrderBookCard,
    },
    data() {
        return {
            datas: [],
            datas2: [],
            total: 0,
            date: "",
            month: "",
            year: "",
            orderDetailsVisibility: {},
            type: 0,
        }
    },
    methods: {
        async fetchData() {
            try {
                this.datas = await OrderService.getSuccessOrder();
            } catch (error) {
                console.log(error);
            }
        },
        totalType(type) {
            this.type = type;
        },
        getM(data) {
            const d = new Date(data);
            const month = "" + (d.getMonth() + 1);
            return month;
        },
        getY(data) {
            const d = new Date(data);
            const year = d.getFullYear();
            return year;
        },
        totalAll() {
            this.type = 0;
            this.total = 0;
            this.datas2 = this.datas;
            for (let i = 0; i < this.datas2.length; i++) {
                this.total += this.datas2[i].total;
            };
            this.total = this.changeMoney(this.total);
        },
        totalDate() {
            this.total = 0;
            this.datas2 = [];
            for (let index = 0; index < this.datas.length; index++) {
                if (this.date === this.datas[index].date) {
                    this.total += this.datas[index].total;
                    this.datas2.push(this.datas[index]);
                }
            }
            this.total = this.changeMoney(this.total);
        },
        totalMonth() {
            this.total = 0;
            this.datas2 = [];
            for (let index = 0; index < this.datas.length; index++) {
                const m = this.getM(this.datas[index].date);
                const y = this.getY(this.datas[index].date);
                if ((this.month == m) && (this.year == y)) {
                    this.total += this.datas[index].total;
                    this.datas2.push(this.datas[index]);
                }
            }
            this.total = this.changeMoney(this.total);
        },
        totalYear() {
            this.total = 0;
            this.datas2 = [];
            for (let index = 0; index < this.datas.length; index++) {
                const y = this.getY(this.datas[index].date);
                if ((this.year == y)) {
                    this.total += this.datas[index].total;
                    this.datas2.push(this.datas[index]);
                }
            }
            this.total = this.changeMoney(this.total);
        },
        toggleOrderDetail(orderId) {
            this.orderDetailsVisibility[orderId] = !this.orderDetailsVisibility[orderId];
        },
        isOrderDetailVisible(orderId) {
            return this.orderDetailsVisibility[orderId];
        },
        changeMoney(money) {
            const VND = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return VND.format(money);
        }
    },
    created() {
        this.fetchData();
    }
}
</script>