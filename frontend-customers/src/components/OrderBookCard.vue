<template>
    <li v-for="item in books" :key="item.bookId" class="list-group-item ms-5">
        <div class="row">
            <router-link :to="{ name: 'bookinfo', params: { bookId: item.bookId } }" class="col"><img class="img-fluid"
                    style="height: 50px; width: 50px; margin: 0 auto;" :src="item.hinh"
                    :alt="item.tensach"></router-link>
            <p class="col">{{ item.tensach }}</p>
            <p class="col">{{ item.price }}</p>
            <p class="col">{{ item.quantity }}</p>
            <p class="col">{{ item.price * item.quantity }}</p>
            <button v-if="status === 'Đã mua hàng thành công'" class="btn btn-sm btn-outline-success col" style="height: 30px;" @click="showDanhGia(item.bookId)">
                Đánh giá
            </button>
        </div>
        <div v-if="danhgia == true && idDanhgia == item.bookId">
            <div v-if="star == 0">
                <div class="d-flex justify-content-end">
                    <input type="radio" class="form-check-input" name="star" value="1" id="1" v-model="rate.rating"
                        @input="getValueStar">
                    <label for="star" class="form-check-lable">1<i class="fa-regular fa-star"></i></label>
                    <input type="radio" class="form-check-input" name="star" value="2" id="2" v-model="rate.rating"
                        @input="getValueStar">
                    <label for="star" class="form-check-lable">2<i class="fa-regular fa-star"></i></label>
                    <input type="radio" class="form-check-input" name="star" value="3" id="3" v-model="rate.rating"
                        @input="getValueStar">
                    <label for="star" class="form-check-lable">3<i class="fa-regular fa-star"></i></label>
                    <input type="radio" class="form-check-input" name="star" value="4" id="4" v-model="rate.rating"
                        @input="getValueStar">
                    <label for="star" class="form-check-lable">4<i class="fa-regular fa-star"></i></label>
                    <input type="radio" class="form-check-input" name="star" value="5" id="5" v-model="rate.rating"
                        @input="getValueStar">
                    <label for="star" class="form-check-lable">5<i class="fa-regular fa-star"></i></label>
                </div>
                <div class="d-flex justify-content-end">
                    <textarea name="cmt" v-model="rate.review" maxlength="200" class="form-control w-50"
                        placeholder="Thêm nhận xét của bạn(Tối đa 200 kí tự)"></textarea>
                </div>
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-dark mt-1" @click="addRating(item.bookId)">Lưu</button>
                </div>
            </div>
            <div v-else class="mt-3">
                <p>Đánh giá của bạn: {{ star }}/5</p> 
                <p style="max-width: 100%;overflow-wrap: break-word;">Nhận xét: {{ cmt }}</p>
            </div>
        </div>
    </li>
</template>
<script>
import RateService from '@/services/rate.service';
import OrderService from '@/services/order.service';
import CustomerService from '@/services/customer.service';
export default {
    props: {
        books: { type: Array, required: true },
        index: { type: Number, required: true },
        orderId: { type: String, required: true },
        status:{ type: String},
    },
    emits:['order:change'],
    data() {
        return {
            star: 0,
            cmt: "",
            danhgia: false,
            idDanhgia: "",
            rate: {
                username: "",
                hoten: "",
                bookId: "",
                rating: 0,
                review: "",
                orderId: "",
            },
            user: "",
        }
    },
    methods: {
        async showDanhGia(id) {
            if(this.danhgia == true && this.idDanhgia == id)
            {
                this.danhgia = false;
            }
            else
            {
                this.danhgia = true;
                this.idDanhgia = id;
            }
            this.star = 0;
            this.cmt = "";
            const order = await OrderService.findById(this.orderId);
            if (order.rating == 1) {
                try {
                    const data = {
                        orderId: this.orderId,
                        bookId: id,
                    };
                    var exitsRate = await RateService.findOne(data);
                    if(exitsRate[0].orderId === this.orderId){
                        this.star = exitsRate[0].rating;
                        this.cmt = exitsRate[0].review;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async addRating(bookId) {
            this.rate.username = this.user._id;
            this.rate.hoten = this.user.hoten;
            this.rate.bookId = bookId;
            this.rate.orderId = this.orderId;
            console.log(this.rate);
            try {
                const order = { rating: 1 };
                await RateService.create(this.rate);
                await OrderService.update(this.orderId, order);
                alert('Bạn đã gửi đánh giá thành công');
                this.$emit("order:change");
            } catch (error) {
                console.log(error);
            }
        },
        async getUser() {
            this.user = await CustomerService.get(sessionStorage.getItem("userName"));
        }
    },
    created() {
        this.getUser();
    }
}
</script>