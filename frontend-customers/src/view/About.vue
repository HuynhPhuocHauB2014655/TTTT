<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h1 class="text-center fs-2 mt-2">LIÊN HỆ VỚI CHÚNG TÔI</h1>
    <hr>
    <div class="row">
        <div class="col-sm">
            <h3>Liên hệ với chúng tôi!</h3>
            <p>Chúng tôi mong muốn lắng nghe từ bạn. Hãy liên hệ với chúng tôi và một thành viên của chúng tôi sẽ liên
                lạc với bạn trong thời gian sớm nhất. Chúng tôi yêu thích việc nhận được phản hồi của bạn mỗi ngày.</p>
            <p>
                <strong>Facebook:</strong> <a
                    class="text-decoration-none link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    href="https://www.facebook.com/"><i class="fa-brands fa-facebook"></i></a>
                <br />
                <strong>Youtube:</strong> <a
                    class="text-decoration-none link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    href="https://www.youtube.com/"><i class="fa-brands fa-youtube"></i></a>
                <br />
                <strong>Twitter:</strong> <a
                    class="text-decoration-none link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    href="https://twitter.com/"><i class="fa-brands fa-twitter"></i></a>
                <br />
                <strong>Số điện thoại:</strong> +84999999999
                <br />
                <strong>Địa chỉ 1:</strong> Khu II, Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ.
                <br />
                <strong>Địa chỉ 2:</strong> Trường CNTT&TT, Đại học Cần Thơ, Xuân Khánh, Ninh Kiều, Cần Thơ.

            </p>
        </div>
        <div class="col-sm-5">
            <h5>Bản đồ</h5>
            <p>
                <a href="#">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d62858.851024790325!2d105.75871999999995!3d10.043392000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1699085745539!5m2!1svi!2s"
                        width="500" height="350" style="border:0;" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"></iframe><br />
                </a>
                <br />
                <a class="text-decoration-none"
                    href="https://www.google.com/maps/@10.043392,105.75872,13z?hl=vi-VN&entry=ttu">Xem bản đồ</a>
            </p>

        </div>
    </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import CartService from "@/services/cart.service";
export default {
    components: {
        AppHeader
    },
    data() {
        return {
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    methods: {
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