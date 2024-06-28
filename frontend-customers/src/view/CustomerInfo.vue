<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <div style="width: 70%;margin: auto;">
        <table class="table table-hover text-center p-2">
            <thead>
                <tr>
                    <th scope="col" colspan="2" class="text-center">Thông tin của bạn</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">Tên đăng nhập:</th>
                    <td>{{ user._id }}</td>
                </tr>
                <tr>
                    <th scope="row">Họ và tên:</th>
                    <td>{{ user.hoten }}</td>
                </tr>
                <tr>
                    <th scope="row">Địa chỉ:</th>
                    <td>{{ user.diachi }}</td>
                </tr>
                <tr>
                    <th scope="row">Số điện thoại:</th>
                    <td>{{ user.sdt }}</td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex">
            <button class="btn btn-sm btn-primary me-2" @click="ChangePassField()">Đổi mật khẩu</button>
            <button class="btn btn-sm btn-success" @click="ChangeInfoField()">Chỉnh sửa thông tin</button>
        </div>
        <p>{{ message }}</p>
        <Form @submit="changePassword" :validation-schema="passwordFormSchema" v-if="changePassField"
            class="mt-3 border rounded border-3 p-2" style="background: #FBF6E5;">
            <h5 class="text-center">Đổi mật khẩu</h5>
            <div class="row">
                <div class="col-md">
                    <label for="old_password" class="form-label">Mật khẩu cũ</label>
                    <Field type="password" name="old_password" class="form-control mb-3"
                        placeholder="Nhập mật khẩu hiện tại" v-model="changePass.old_password" />
                    <ErrorMessage name="old_password" class="error-feedback" />
                </div>
                <div class="col-md">
                    <label for="new_password" class="form-label">Mật khẩu mới</label>
                    <Field type="password" name="new_password" class="form-control mb-3" placeholder="Nhập mật khẩu mới"
                        v-model="changePass.password" />
                    <ErrorMessage name="new_password" class="error-feedback" />
                </div>
                <div class="col-md">
                    <label for="confirm_password" class="form-label">Xác nhận mật khẩu mới</label>
                    <Field type="password" name="confirm_password" class="form-control mb-3"
                        placeholder="Nhập lại mật khẩu mới" />
                    <ErrorMessage name="confirm_password" class="error-feedback" />
                </div>
            </div>
            <button class="btn btn-sm btn-outline-primary" style="width: 30%;">Lưu</button>
        </Form>
        <Form @submit="changeUserInfo()" :validation-schema="userFormSchema" v-if="changeInfoField"
            class="mt-3 border rounded border-3 p-2" style="background: #FBF6E5;">
            <h5 class="text-center">Chỉnh sửa thông tin</h5>
            <div class="row">
                <div class="col-md">
                    <label for="hoten" class="form-label">Họ và tên</label>
                    <Field type="text" name="hoten" class="form-control mb-3" v-model="changeInfo.name" />
                    <ErrorMessage name="hoten" class="error-feedback" />
                </div>
                <div class="col-md">
                    <label for="diachi" class="form-label">Địa chỉ</label>
                    <Field type="text" name="diachi" class="form-control mb-3" v-model="changeInfo.address" />
                    <ErrorMessage name="diachi" class="error-feedback" />
                </div>
                <div class="col-md">
                    <label for="sdt" class="form-label">Số điện thoại</label>
                    <Field type="text" name="sdt" class="form-control mb-3" v-model="changeInfo.phone" />
                    <ErrorMessage name="sdt" class="error-feedback" />
                </div>
            </div>
            <button class="btn btn-sm btn-outline-primary" style="width: 30%;">Lưu</button>
        </Form>
    </div>
</template>
<style scoped>
.error-feedback {
    color: red;
}
</style>
<script>
import CustomerService from "@/services/customer.service";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import CartService from "@/services/cart.service";
export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        AppHeader
    },
    data() {
        const passwordFormSchema = yup.object().shape({
            old_password: yup
                .string()
                .required("Mật khẩu không được bỏ trống.")
                .min(4, "Mật khẩu phải ít nhất 4 ký tự."),
            new_password: yup
                .string()
                .required("Mật khẩu không được bỏ trống.")
                .min(4, "Mật khẩu phải ít nhất 4 ký tự."),
            confirm_password: yup
                .string()
                .required("Mật khẩu không được bỏ trống.")
                .min(4, "Mật khẩu phải ít nhất 4 ký tự.")
                .oneOf([yup.ref('new_password'), null], 'Mật khẩu xác nhận không khớp.'),
        });
        const userFormSchema = yup.object().shape({
            hoten: yup
                .string()
                .required("Tên không được bỏ trống.")
                .min(2, "Tên phải ít nhất 2 ký tự.")
                .max(50, "Tên có nhiều nhất 50 ký tự."),
            diachi: yup
                .string()
                .required("Địa chỉ không được bỏ trống.")
                .max(100, "Địa chỉ tối đa 100 ký tự."),
            sdt: yup
                .string()
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Số điện thoại không hợp lệ."
                )
        });
        return {
            user: {},
            changePassField: false,
            changeInfoField: false,
            userFormSchema,
            passwordFormSchema,
            changePass: {
                username: sessionStorage.getItem("userName"),
                old_password: "",
                password: "",
            },
            changeInfo: {
                username: sessionStorage.getItem("userName"),
                name: "",
                address: "",
                phone: "",
            },
            message: "",
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    methods: {
        async getUserData() {
            try {
                this.user = await CustomerService.get(this.changePass.username);
            } catch (error) {
                console.log(error);
            }
        },
        ChangePassField() {
            this.changeInfoField = false;
            this.changePassField = !this.changePassField;
        },
        ChangeInfoField() {
            this.changeInfo.name = this.user.hoten;
            this.changeInfo.address = this.user.diachi;
            this.changeInfo.phone = this.user.sdt;
            this.changePassField = false;
            this.changeInfoField = !this.changeInfoField;
        },
        async changePassword() {
            try {
                const result = await CustomerService.update(this.changePass.username, this.changePass);
                this.message = result.message;
                this.changePassField = false;
            } catch (error) {
                this.message = error.response.data.message;
            }
        },
        async changeUserInfo() {
            try {
                const result = await CustomerService.update(this.changeInfo.username, this.changeInfo);
                this.message = result.message;
                this.getUserData();
                this.changeInfoField = false;
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
            this.getUserData();
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