<template>
    <div>
        <h3 class="text-center border border-2 border-info py-2 mt-2">Chi tiết Sách</h3>
        <div class="card my-2" style="background: #f7eac3;">
            <div class="row g-0">
                <div class="col-md">
                    <img :src="book.hinh" class="img-fluid rounded m-2" alt="book-image">
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BookService from "@/services/book.service";
export default {
    props: {
        bookId: { type: String, required: true }
    },
    data() {
        return {
            book: [],
            quantity: 1,
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
        addToCart() {
            console.log(this.quantity);
        },
        payment() {
            console.log(this.quantity);
        }
    },
    created() {
        this.getBook();
    }
}
</script>