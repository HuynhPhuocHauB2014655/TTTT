<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <div style="display: flex; justify-content: center; align-items: center; margin: auto 0;">
        <Form @submit="login" :validation-schema="userFormSchema" style="width: 45%;background: #EFF7FF;"
            class="p-3 border rounded border-primary">
            <div class="text-center my-4 fs-3 pb-2 text-primary border-bottom border-3 border-primary">Đăng nhập</div>
            <div class="row mb-4 mx-2 px-3 pt-3">
                <label for="username" class="col-sm-4 col-form-label fw-bold">Tên đăng nhập:</label>
                <div class="col-sm-8">
                    <Field name="username" type="text" class="form-control" v-model="User.username"
                        placeholder="Nhập vào tên đăng nhập" />
                    <ErrorMessage name="username" class="error-feedback" />
                </div>
            </div>
            <div class="row mb-4 p-3 mx-2">
                <label for="password" class="col-sm col-form-label fw-bold">Mật khẩu:</label>
                <div class="col-sm-8">
                    <Field name="password" type="password" class="form-control" v-model="User.password"
                        placeholder="Nhập vào mật khẩu" />
                    <ErrorMessage name="password" class="error-feedback" />
                </div>
            </div>
            <p class="ms-4 error-feedback">{{ message }}</p>
            <div>
                <button type="submit" class="col btn btn-outline-primary ms-4 py-2">Đăng Nhập</button>
                <span class="ms-3">Bạn chưa có tài khoản? </span><router-link :to="{ name: 'registerPage' }">Đăng
                    Ký</router-link>
            </div>
        </Form>
    </div>
</template>
<style scoped>
.error-feedback {
    color: red;
}
</style>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import CustomerService from "@/services/customer.service";
import CartService from "@/services/cart.service";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        AppHeader
    },
    data() {
        const userFormSchema = yup.object().shape({
            username: yup
                .string()
                .required("Tên đăng nhập không được bỏ trống.")
                .min(4, "Tên đăng nhập phải ít nhất 4 ký tự."),
            password: yup
                .string()
                .required("Mật khẩu không được bỏ trống.")
                .min(4, "Mật khẩu phải ít nhất 4 ký tự."),
        });
        return {
            User: {
                username: "",
                password: ""
            },
            userFormSchema,
            message: '',
            cartItem: {
                username: "",
                bookId: "",
                price: 0,
                quantity: 1,
                hinh: "",
                tensach: "",
            },
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        };
    },
    methods: {
        async login() {
            try {
                localStorage.removeItem('reloaded');
                const user = await CustomerService.login(this.User);
                sessionStorage.setItem('userName', user._id);

                const guestCart = await CartService.get(sessionStorage.getItem("guest"));
                console.log(guestCart);

                if (guestCart) {
                    for (const cart of guestCart) {
                        console.log(cart);
                        this.cartItem.username = user._id;
                        this.cartItem.bookId = cart.bookId;
                        this.cartItem.price = cart.price;
                        this.cartItem.quantity = cart.quantity;
                        this.cartItem.hinh = cart.hinh;
                        this.cartItem.tensach = cart.tensach;
                        console.log(cart);
                        try {
                            const result = await CartService.create(user._id, this.cartItem);
                            console.log(result);
                        } catch (error) {
                            console.log(error);
                        }
                    }
                    try {
                        const response = await CartService.deleteAll(sessionStorage.getItem("guest"));
                        sessionStorage.removeItem("guest");
                    } catch (error) {
                        console.log(error);
                    }
                }
                this.$router.replace({ path: "/" });
            } catch (error) {
                this.message = error.response.data.message;
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
            this.isLoggedIn();
            this.getCartCount();
            this.getNotifyCount();
        }
    },
    created(){
        this.getData();
    }
}
</script>