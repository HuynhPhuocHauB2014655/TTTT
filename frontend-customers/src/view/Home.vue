<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <div class="row">
        <div class="m-3 row col-md-8">
            <div class="col-sm">
                <Publisher @choose:publisher="getPublisherC"></Publisher>
            </div>
            <div class="col-sm">
                <SelectType @choose:type="getTypeC"></SelectType>
            </div>
            <div class="col-sm">
                <SelectPrice @choose:price="getPrice"></SelectPrice>
            </div>
        </div>
        <form class="col-md m-auto">
            <input type="text" class="form-control" v-model="searchText" placeholder="Nhập vào tên sách cần tìm kiếm">
        </form>
    </div>
    <Books v-if="filteredBooksCount > 0" :books="filteredBooks" @add:cart="addCart"/>
    <p class="fs-3 text-center mt-5" v-else>Không có sách nào!</p>
</template>

<script>
import BookService from "@/services/book.service";
import Books from "@/components/Books.vue";
import Publisher from "@/components/SelectPublisher.vue";
import SelectType from "@/components/SelectType.vue";
import SelectPrice from "@/components/SelectPrice.vue";
import AppHeader from "@/components/AppHeader.vue";
import CartService from "@/services/cart.service";
import NotifyService from "@/services/notify.service";
export default
    {
        components: {
            Books,
            SelectType,
            SelectPrice,
            Publisher,
            AppHeader,
        },
        data() {
            return {
                books: [],
                searchText: '',
                searchBook: [],
                publishers: [],
                booksT: [],
                booksT1: [],
                selectPub: "",
                typeC: "",
                price: 0,
                cartCount: 0,
                notifyCount: 0,
                logined: 0,
                userName: "",
            };
        },
        computed: {
            bookStrings() {
                return this.books.map((book) => {
                    const { tensach } = book;
                    return [this.removeAccents(tensach)].join().toLowerCase();
                });
            },
            filteredBooks() {
                if (!this.searchText) {
                    return this.bookSelect();
                }

                return this.books.filter((_book, index) => {
                    return this.bookStrings[index].includes(this.removeAccents(this.searchText).toLowerCase());
                });


            },
            bookStrings2() {
                return this.books.map((book) => {
                    const { nxb } = book;
                    return [nxb];
                });
            },
            bookStrings3() {
                return this.booksT.map((book) => {
                    const { theloai } = book;
                    return [theloai];
                });
            },
            filteredBooksCount() {
                return this.filteredBooks.length;
            },
        },
        methods:
        {
            addCart(tensach) {
                alert(`Đã thêm ${tensach} vào giỏ hàng`);
                this.getCartCount();
            },
            bookSelect() {
                if (this.selectPub && this.typeC && this.price) {
                    this.booksT = this.books.filter((_book, index) => {
                        return this.bookStrings2[index].includes(this.selectPub);
                    });
                    this.booksT1 = this.booksT.filter((_book, index) => {
                        return this.bookStrings3[index].includes(this.typeC);
                    });
                    return this.opPrice(this.price);
                } else if (this.selectPub && this.typeC) {
                    this.booksT = this.books.filter((_book, index) => {
                        return this.bookStrings2[index].includes(this.selectPub);
                    });
                    return this.booksT.filter((_book, index) => {
                        return this.bookStrings3[index].includes(this.typeC);
                    });
                } else if (this.selectPub && this.price) {
                    this.booksT1 = this.books.filter((_book, index) => {
                        return this.bookStrings2[index].includes(this.selectPub);
                    });
                    return this.opPrice(this.price);
                } else if (this.typeC && this.price) {
                    this.booksT1 = this.booksT.filter((_book, index) => {
                        return this.bookStrings3[index].includes(this.typeC);
                    });
                    return this.opPrice(this.price);
                } else if (this.selectPub) {
                    return this.booksT.filter((_book, index) => {
                        return this.bookStrings2[index].includes(this.selectPub);
                    });
                } else if (this.typeC) {
                    return this.booksT.filter((_book, index) => {
                        return this.bookStrings3[index].includes(this.typeC);
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
            getTypeC(data) {
                this.typeC = data;
            },
            getPublisherC(data) {
                this.selectPub = data;
            },
            getPrice(data) {
                this.price = data;
            },
            async retrieveBooks() {
                this.price = 0;
                this.typeC = "";
                this.selectPub = "";
                try {
                    this.books = await BookService.getAll();
                    this.booksT = this.books;
                    this.booksT1 = this.books;
                }
                catch (error) {
                    console.log(error);
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
            async getData(){
                this.retrieveBooks();
                this.isLoggedIn();
                this.getCartCount();
                this.getNotifyCount();
            }
        },
        mounted() {
            if (localStorage.getItem('reloaded')) {
            } else {
                localStorage.setItem('reloaded', '1');
                location.reload();
            }
            this.getData();
        },
    }
</script>