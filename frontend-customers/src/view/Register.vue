<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <div style="display: flex; justify-content: center; align-items: center; margin: auto 0; padding: 12px;">
        <div v-if="this.success" style="width: 50%; background: #EFF7FF;"
            class="text-center border border-4 border-success">
            <p class="fs-4 pt-3 text-success">{{ message }}</p>
            <router-link :to="{ path: '/login' }" class="btn btn-outline-success mb-2">Đăng Nhập</router-link>
        </div>
        <Form v-else @submit="register" :validation-schema="userFormSchema" style="width: 90%; background: #EFF7FF;"
            class="p-3 border rounded border-primary">
            <div class="text-center my-4 fs-3 pb-2 text-primary border-bottom border-3 border-primary">Đăng ký</div>
            <div class="row">
                <div class="col-sm">
                    <h4 class="text-center border-bottom">Thông tin đăng nhập</h4>
                    <div class="row mb-4 mx-2 px-3 pt-3">
                        <label for="username" class="col-sm col-form-label fw-bold">Tên đăng nhập:</label>
                        <div class="col-sm-7">
                            <Field name="username" type="text" class="form-control" v-model="User.username"
                                placeholder="Nhập vào tên đăng nhập" />
                            <ErrorMessage name="username" class="error-feedback" />
                        </div>
                    </div>
                    <div class="row mb-4 mx-2 px-3 pt-3">
                        <label for="password" class="col-sm col-form-label fw-bold">Mật khẩu:</label>
                        <div class="col-sm-7">
                            <Field name="password" type="password" class="form-control" v-model="User.password"
                                placeholder="Nhập vào mật khẩu" />
                            <ErrorMessage name="password" class="error-feedback" />
                        </div>
                    </div>
                    <div class="row mb-4 mx-2 px-3 pt-3">
                        <label for="confirm_password" class="col-sm col-form-label fw-bold">Xác nhận mật khẩu:</label>
                        <div class="col-sm-7">
                            <Field name="confirm_password" type="password" class="form-control"
                                placeholder="Nhập lại mật khẩu" />
                            <ErrorMessage name="confirm_password" class="error-feedback" />
                        </div>
                    </div>
                </div>
                <div class="col-sm-1 border-start border-end border-2 border-primary" style="width: 1px;"></div>
                <div class="col-sm">
                    <h4 class="text-center border-bottom">Thông tin cá nhân</h4>
                    <div class="row mb-4 mx-2 px-3 pt-3">
                        <label for="name" class="col-sm col-form-label fw-bold">Họ và tên:</label>
                        <div class="col-sm-7">
                            <Field name="name" type="text" class="form-control" v-model="User.name"
                                placeholder="Nhập vào họ và tên" />
                            <ErrorMessage name="name" class="error-feedback" />
                        </div>
                    </div>
                    <div class="row mb-4 mx-2 px-3 pt-3">
                        <label for="address" class="col-sm col-form-label fw-bold">Địa chỉ:</label>
                        <div class="col-sm-7">
                            <Field name="address" type="text" class="form-control" v-model="User.address"
                                placeholder="Nhập vào địa chỉ" />
                            <ErrorMessage name="address" class="error-feedback" />
                        </div>
                    </div>
                    <div class="row mb-4 p-3 mx-2">
                        <label for="phone" class="col-sm col-form-label fw-bold">Số điện thoại:</label>
                        <div class="col-sm-7">
                            <Field name="phone" type="tel" class="form-control" v-model="User.phone"
                                placeholder="Nhập vào số điện thoại" />
                            <ErrorMessage name="phone" class="error-feedback" />
                        </div>
                    </div>
                </div>
            </div>
            <p v-if="!this.success" class="ms-4 error-feedback">{{ message }}</p>
            <div>
                <button type="submit" class="col btn btn-outline-primary ms-4 py-2">Đăng ký</button>
                <span class="ms-3">Bạn đã có tài khoản? <router-link :to="{ name: 'loginPage' }">Đăng
                        Nhập</router-link></span>
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
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import CartService from "@/services/cart.service";
export default {

    components: {
        Form,
        Field,
        ErrorMessage,
        CustomerService
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
                .min(4, "Mật khẩu phải ít nhất 4 ký tự.")
                .max(20, "Mật khẩu tối đa 20 ký tự."),
            confirm_password: yup
                .string()
                .required("Mật khẩu xác nhận không được bỏ trống.")
                .min(4, "Mật khẩu phải ít nhất 4 ký tự.")
                .max(20, "Mật khẩu tối đa 20 ký tự.")
                .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp.'),
            name: yup
                .string()
                .required("Tên không được bỏ trống.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            address: yup
                .string()
                .required("Địa chỉ không được bỏ trống.")
                .max(100, "Địa chỉ tối đa 100 ký tự."),
            phone: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                )
        });
        return {
            User: {
                username: "",
                password: "",
                name: "",
                address: "",
                phone: "",
            },
            userFormSchema,
            message: '',
            success: false,
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        };
    },
    methods: {
        async register() {
            try {
                const result = await CustomerService.create(this.User);
                this.success = true;
                this.message = result;
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
    created() {
        this.getData();
    }
}
</script>