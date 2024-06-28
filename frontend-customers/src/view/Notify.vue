<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h1 class="my-3 text-center">Danh sách thông báo</h1>
    <hr>
    <ul v-if="notify[0]" class="list-group">
        <li v-for="(item, index) in notify" :key="item._id" class="list-group-item">
            <p class="d-flex justify-content-between">
                <button class="btn btn-primary px-5" :data-bs-toggle="'collapse-' + index"
                    :data-bs-target="'#collapse-' + index" aria-expanded="false" :aria-controls="'collapse-' + index"
                    @click="changeCollapse(index)">
                    {{ item.title }}
                </button>
                <button @click="deleteNotify(item._id)" class="btn btn-danger">
                    Xóa <i class="fas fa-trash"></i>
                </button>
            </p>
            <div class="collapse" :id="'collapse-' + index">
                <div class="card card-body">
                    {{ item.content }}
                </div>
            </div>
        </li>
    </ul>
    <h3 v-else class="text-center"> Bạn chưa có thông báo nào!</h3>
</template>
<script>
import NotifyService from "@/services/notify.service";
import AppHeader from "@/components/AppHeader.vue";
import CartService from "@/services/cart.service";
export default {
    data() {
        return {
            notify: [],
            username: "",
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    components: {
        AppHeader
    },
    methods: {
        getUserName() {
            this.username = sessionStorage.getItem("userName");
            console.log(this.username);
        },
        async getNotifyUser(user) {
            try {
                this.notify = await NotifyService.getNotify(user);
                console.log(this.notify);
            } catch (error) {
                console.log(error);
            }
        },
        changeCollapse(index) {
            const elm = document.getElementById('collapse-' + index);

            if (!elm.classList.contains("show")) {
                elm.classList.add("show");
            } else {
                elm.classList.remove("show");
            }
        },
        async deleteNotify(id) {
            if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
                try {
                    console.log(await NotifyService.deleteOne(id));
                    location.reload();
                } catch (error) {
                    console.log(error);
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
            this.getUserName();
            this.getNotifyUser(this.username);
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