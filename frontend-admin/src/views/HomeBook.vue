<template>
    <div>
        <div>
            <div class="col w-50 mb-2">
                <SearchBook v-model="searchText" />
            </div>
            <div class="row w-50">
                <div class="col">
                    <Publisher @choose:publisher="getPublisherC"></Publisher>
                </div>
                <div class="col">
                    <SelectType @choose:type="getTypeC"></SelectType>
                </div>
                <div class="col">
                    <SelectPrice @choose:price="getPrice"></SelectPrice>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="mt-3 col-md-5">
                <h4>
                    Tất cả sách
                    <i class="fas fa-book"></i>
                </h4>
                <BookList v-if="filteredBooksCount > 0" :books="filteredBooks" v-model:activeIndex="activeIndex" />
                <p v-else>Không có sách nào.</p>


                <!-- ----------------------------------------------------------------- -->
                <div class="mt-3 d-flex justify-content-around align-items-center">
                    <button class="btn btn-sm btn-primary" @click="refreshList()">
                        <i class="fas fa-redo"></i> Làm mới
                    </button>

                    <button class="btn btn-sm btn-success" @click="changeType('add')">
                        <i class="fas fa-plus"></i> Thêm mới
                    </button>

                    <button class="btn btn-sm btn-danger" @click="removeAllBooks">
                        <i class="fas fa-trash"></i> Xóa tất cả
                    </button>
                </div>
            </div>
            <!-- ----------------------------------------------------------------- -->
            <div class="mt-3 col-md-7">
                <div v-if="activeBook != null">
                    <h4>
                        Thông tin chi tiết sách
                        <i class="fas fa-book"></i>
                    </h4>
                    <BookCard :book="activeBook" />
                    <!-- <router-link :to="{
                        name: 'book-edit',
                        params: { id: activeBook._id }
                    }" class="btn btn-sm btn-outline-primary mt-2">
                        <span class="badge badge-warning text-dark">
                            <i class="fas fa-edit ">
                            </i> Hiệu chỉnh
                        </span>
                    </router-link> -->
                    <button class="btn btn-sm btn-outline-primary mt-2" @click="changeType('edit')">Chỉnh sửa</button>
                    <p>{{ message }}</p>
                </div>
            </div>
        </div>
        <div v-if="type === 'edit'" class="mt-3 border border-dark p-3 rounded mb-3">
            <div class="d-flex justify-content-between">
                <h4>Hiệu chỉnh sách</h4>
                <div class="text-danger" @click="changeType('')">
                    <i class="fa-solid fa-x" style="cursor: pointer;"></i>
                </div>
            </div>
            <hr>
            <BookForm :book="activeBook" :type="type" @submit:book="updateBook" @delete:book="deleteBook" />

        </div>
        <div v-if="type === 'add'" class="mt-3 border border-dark p-3 rounded mb-3">
            <div class="d-flex justify-content-between">
                <h4>Thêm sách</h4>
                <div class="text-danger" @click="changeType('')">
                    <i class="fa-solid fa-x" style="cursor: pointer;"></i>
                </div>
            </div>
            <BookForm :book="newBook" :type="type" @submit:book="addBook" />
            <p>{{ message }}</p>
        </div>
    </div>
</template>
<script>

import BookList from "@/components/BookList.vue";
import BookCard from "@/components/BookCard.vue";
import BookService from "@/services/book.service";
import SearchBook from "@/components/InputSearch.vue";
import Publisher from "@/components/SelectPublisher.vue";
import SelectType from "@/components/SelectType.vue";
import SelectPrice from "@/components/SelectPrice.vue";
import BookForm from '@/components/BookForm.vue';
export default {
    components: {
        SearchBook,
        Publisher,
        BookList,
        BookCard,
        SelectType,
        SelectPrice,
        BookForm
    },
    data() {
        return {
            publishers: [],
            books: [],
            booksT: [],
            booksT1: [],
            activeIndex: -1,
            searchText: "",
            selectPub: "",
            typeC: "",
            price: 0,
            message: "",
            type: "",
            newBook: {
                _id: "",
                tensach: null,
                hinh: null,
                theloai: null,
                sotrang: null,
                nxb: null,
                gia: null,
                soquyen: null,
                ngonngu: null
            },
        };
    },
    watch: {
        // Giám sát các thay đổi của biến searchText.
        //  Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        // Chuyển các đối tượng contact thành chuỗi để tiện cho tìm kiếm.
        bookStrings() {
            return this.books.map((book) => {
                const { tensach } = book;
                return [this.removeAccents(tensach)].join().toLowerCase();
            });
        },
        nxbStrings() {
            return this.books.map((book) => {
                const { nxb } = book;
                return [nxb];
            });
        },
        theloaiStrings() {
            return this.booksT.map((book) => {
                const { theloai } = book;
                return [theloai];
            });
        },

        // Trả về các contact có chứa thông tin cần tìm kiếm.
        filteredBooks() {
            if (!this.searchText) {
                return this.bookSelect();
            }

            return this.books.filter((_book, index) => {
                return this.bookStrings[index].includes(this.removeAccents(this.searchText).toLowerCase());
            });


        },
        activeBook() {
            if (this.activeIndex < 0) {
                return null;
            }
            else {
                return this.filteredBooks[this.activeIndex];
            }

        },

        filteredBooksCount() {
            return this.filteredBooks.length;
        },
    },
    methods: {
        changeType(type) {
            this.type = type;
            this.message ="";
        },
        async addBook(data) {
            try {
                await BookService.create(data);
                this.message = "Thêm sách thành công";
                this.type = "";
            } catch (error) {
                console.log(error);
            }
        },
        async updateBook(data) {
            try {
                await BookService.update(data._id, data);
                this.message = "Sách được cập nhật thành công.";
                this.type = "";
            } catch (error) {
                console.log(error);
            }
        },

        async deleteBook(id) {
            if (confirm("Bạn muốn xóa sách này?")) {
                try {
                    await BookService.delete(id);
                } catch (error) {
                    console.log(error);
                }
            }
        },
        bookSelect() {
            if (this.selectPub && this.typeC && this.price) {
                this.booksT = this.books.filter((_book, index) => {
                    return this.nxbStrings[index].includes(this.selectPub);
                });
                this.booksT1 = this.booksT.filter((_book, index) => {
                    return this.theloaiStrings[index].includes(this.typeC);
                });
                return this.opPrice(this.price);
            } else if (this.selectPub && this.typeC) {
                this.booksT = this.books.filter((_book, index) => {
                    return this.nxbStrings[index].includes(this.selectPub);
                });
                return this.booksT.filter((_book, index) => {
                    return this.theloaiStrings[index].includes(this.typeC);
                });
            } else if (this.selectPub && this.price) {
                this.booksT1 = this.books.filter((_book, index) => {
                    return this.nxbStrings[index].includes(this.selectPub);
                });
                return this.opPrice(this.price);
            } else if (this.typeC && this.price) {
                this.booksT1 = this.booksT.filter((_book, index) => {
                    return this.theloaiStrings[index].includes(this.typeC);
                });
                return this.opPrice(this.price);
            } else if (this.selectPub) {
                return this.booksT.filter((_book, index) => {
                    return this.nxbStrings[index].includes(this.selectPub);
                });
            } else if (this.typeC) {
                return this.booksT.filter((_book, index) => {
                    return this.theloaiStrings[index].includes(this.typeC);
                });
            } else if (this.price) {
                console.log(this.price);
                return this.opPrice(this.price);
            } else {
                return this.books;
            }
        },
        opPrice(price) {
            switch (price) {
                case '1':
                    return this.booksT1.filter((book) => {
                        return (parseInt(book.gia) < 10000);
                    });
                    break;
                case '2':
                    return this.booksT1.filter((book) => {
                        return (parseInt(book.gia) >= 10000 && parseInt(book.gia) < 30000);
                    });
                    break;
                case '3':
                    return this.booksT1.filter((book) => {
                        return (parseInt(book.gia) >= 30000 && parseInt(book.gia) < 100000);
                    });
                    break;
                case '4':
                    return this.booksT1.filter((book) => {
                        return (parseInt(book.gia) >= 100000);
                    });
                    break;
                default:
                    return this.books;
                    break;
            }
        },
        removeAccents(string) {
            return string.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        },
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
                this.booksT = this.books;
                this.booksT1 = this.books;
            } catch (error) {
                console.log(error);
            }
        },
        getTypeC(data) {
            this.typeC = data;
        },
        getPublisherC(data) {
            this.selectPub = data;
        },
        getPrice(data) {
            this.price = data;
        },
        async removeAllBooks() {
            if (confirm("Bạn muốn xóa tất cả Sach?")) {
                try {
                    await BookService.deleteAll();
                    this.refreshList;
                } catch (error) {
                    console.log(error);
                }
            }
        },

        refreshList() {
            this.price = 0;
            this.typeC = "";
            this.selectPub = "";
            this.retrieveBooks();
            this.activeIndex = -1;
        },

        goToAddBook() {
            this.$router.push({ name: "book-add" });
        },
    },
    mounted() {
        this.refreshList();
    },
};
</script>

<style scoped>
.page {
    text-align: left;
    max-width: 1000px;
}
</style>