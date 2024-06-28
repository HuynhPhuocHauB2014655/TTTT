<template>
    <div class="mb-2">
        <div class="grid-container">
            <div v-for="(book, index) in books" :key="book._id" class="bg-light m-3 rounded px-2 grid-item">
                <router-link :to="{ name: 'bookinfo', params: { bookId: book._id } }"><img class="img-fluid"
                        style="height: 200px; width: 160px; margin: 0 auto;" :src="book.hinh"
                        alt="book_image"></router-link>
                <div class="book-info">
                    <div>
                        {{ book.tensach }}
                    </div>
                    <div class="text-danger">
                        {{ book.gia }}đ
                    </div>
                    <div class="d-flex justify-content-between  ">
                        <p v-if="book.soquyen != 0">Số lượng: {{ book.soquyen }}</p>
                        <p v-else class="text-danger">Đã hết hàng</p>
                        <p v-if="rating[index] > 0">Đánh giá: {{ rating[index] }}/5</p>
                        <p v-else>Chưa có đánh giá</p>
                    </div>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <button class="btn btn-sm btn-outline-primary" @click="addToCart(book)">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" v-if="userName">
                        <router-link class="nav-link" :to="{ name: 'orderconfirm', params: { bookId: book._id } }">
                            Mua ngay
                        </router-link>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style>
.grid-container {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    padding: 5px;
    text-align: center;
}

.grid-item {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: flex;
    flex-direction: column;
}

.book-container {
    display: flex;
    flex-direction: column;
}

.book-info {
    margin-top: auto;
}

@media only screen and (max-width: 1000px) {
    .grid-container {
        display: grid;
        grid-template-columns: 33% 33% 33%;
        padding: 5px;
        text-align: center;
    }
}
@media only screen and (max-width: 768px) {
    .grid-container {
        display: grid;
        grid-template-columns: 50% 50%;
        padding: 5px;
        text-align: center;
    }
}
@media only screen and (max-width: 500px) {
    .grid-container {
        display: grid;
        grid-template-columns: 100%;
        padding: 5px;
        text-align: center;
    }
}
</style>
<script>
import CartService from "@/services/cart.service";
import RateService from "@/services/rate.service";
export default {
    props: {
        books: { type: Array, default: () => [] }
    },
    emits: ['add:cart'],
    data() {
        return {
            cartItem: {
                bookId: "",
                price: "",
                quantity: 1,
            },
            rating: [],
            userName: "",
        }
    },
    computed: {
        rows() {
            const rowCount = Math.ceil(this.books.length / 3);
            const rows = [];
            for (let i = 0; i < rowCount; i++) {
                const start = i * 3;
                const end = Math.min(start + 3, this.books.length);
                rows.push(this.books.slice(start, end));
            }
            return rows;
        },
    },
    methods: {
        async getRate() {
            for (let i = 0; i < this.books.length; i++) {
                const rate = await RateService.getAverageRating(this.books[i]._id);
                this.rating.push(rate.avg_rating);
            }
        },
        goToBookDetail(id) {
            this.$router.push({ name: "bookinfo", params: { bookId: id } });
        },
        async addToCart(book) {
            const userName = sessionStorage.getItem("userName");
            this.cartItem.bookId = book._id;
            this.cartItem.price = book.gia;
            this.cartItem.hinh = book.hinh;
            this.cartItem.tensach = book.tensach;
            if (userName) {
                try {
                    await CartService.create(userName, this.cartItem);
                    this.$emit('add:cart', book.tensach);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                const guest = sessionStorage.getItem("guest");
                await CartService.create(guest, this.cartItem);
                this.$emit('add:cart', book.tensach);
            }
        }
    },
    created() { 
        this.getRate();
        this.userName = sessionStorage.getItem("userName");
    }
};
</script>
