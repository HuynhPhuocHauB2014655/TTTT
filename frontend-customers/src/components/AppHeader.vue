<template>
    <nav class="row navbar navbar-expand navbar-dark bg-primary py-3">
        <div class="col-3 d-flex">
            <router-link :to="{ name: 'homeBook' }" class="navbar-brand border rounded border-dark p-2">
            H&N SHOP
            </router-link>
            <router-link to="/about" class="nav-link my-auto link-light">
                Contact
            </router-link>
            <router-link v-if="isLogined" to="/support" class="nav-link my-auto link-light ms-2">
                Support
            </router-link>  
        </div>
        <div class="col"></div>
        <ul v-if="!isLogined" class="col navbar-nav d-flex justify-content-end">
            <li class="nav-item mx-1"><router-link :to="{ name: 'loginPage' }" class="nav-link">Đăng nhập</router-link>
            </li>
            <li class="nav-item"><router-link :to="{ name: 'registerPage' }" class="nav-link">Đăng ký</router-link></li>
            <li class="nav-item">
                <router-link :to="{name: 'cart'}" class="nav-link position-relative" href="">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span v-if="cartCount != 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {{ cartCount }}
                    </span>
                </router-link>
            </li>
        </ul>
        <ul v-else class="col col-sm-5 navbar-nav d-flex justify-content-end">
            <li class="nav-item">
                <router-link :to="{ name: 'order' }" class="nav-link">Đơn hàng</router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'customerinfo' }" class="nav-link"><i class="fa-solid fa-user " title="Tài khoản"></i></router-link>
            </li>
            <li class="nav-item">
                <router-link :to="{ name: 'notify' }" class="nav-link position-relative">
                    <i class="fas fa-bell" title="Thông báo"></i>
                    <span v-if="notifyCount != 0" class="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-danger">
                        {{ notifyCount }}
                    </span>
                </router-link> 
            </li>
            <li class="nav-item">
                <router-link :to="{name: 'cart'}" class="nav-link position-relative" href="">
                    <i class="fa-solid fa-cart-shopping" title="Giỏ hàng"></i>
                    <span v-if="cartCount != 0" class="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-danger">
                        {{ cartCount }}
                    </span>
                </router-link>
            </li>
            <li class="nav-item"><a class="nav-link" href="#" @click="logout"><i class="fa-solid fa-arrow-right-from-bracket " title="Đăng xuất"></i></a></li>
        </ul>
    </nav>
</template>

<script>
import CartService from "@/services/cart.service";
import CustomerService from "@/services/customer.service";
import NotifyService from "@/services/notify.service";
export default {
    props:{
        cartCount:{
            type: Number, required: true,
        },
        notifyCount: {
            type: Number, required: true,
        },
        isLogined:{
            type: Number,
        }
    },
    data() {
        return {
            ipAddr:"",
        }
    },
    methods: {
        logout() {
            if (confirm('Bạn có chắc muốn đăng xuất không?')) {
                sessionStorage.removeItem("userName");
                localStorage.removeItem('reloaded');
                if(this.$route.name == "homeBook")
                {
                    location.reload();
                }
                else{
                    this.$router.replace({ name: "homeBook" });
                }
            }
        },
        async getGuestIp(){
            this.ipAddr = await CustomerService.getIp();
            sessionStorage.setItem("guest",this.ipAddr);
        },
    },
    mounted(){
        this.getGuestIp();
    }
};
</script>