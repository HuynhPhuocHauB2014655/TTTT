<template>
    <AppHeader :cartCount="cartCount" :notifyCount="notifyCount" :isLogined="logined"></AppHeader>
    <h1 class="text-center">Hỗ trợ</h1>
    <div class="d-flex">
        <div class="fs-3">Câu hỏi của bạn</div>
        <button v-if="supports.length" class="btn btn-sm btn-outline-danger ms-2 mt-2" @click.prevent="DeleteAll()"
            style="height: 30px;">Xóa tất cả</button>
    </div>
    <div v-if="!supports.length" class="ms-2 fs-4">
        Bạn chưa gửi câu hỏi nào
    </div>
    <div v-else class="list-group list-group-flush my-2">
        <div v-for="req in supports" :key="req._id" class="border border-2 p-2 mt-1 position-relative">
            <a href="#" class="position-absolute top-0 end-0 nav-link text-danger m-1"
                @click.prevent="Delete(req._id)">Xóa</a>
            <div>Câu hỏi: {{ req.content }}</div>
            <div v-if="!req.response">
                Phản hồi: Chưa có phản hồi
            </div>
            <div v-else>
                Phản hồi: {{ req.response }}
            </div>
        </div>
    </div>
    <div class="mb-2">
        <h4>
            Gửi bất kì thắc mắc nào liên quan tới cửa hàng của chúng tôi
        </h4>
        <form @submit.prevent="submit">
            <textarea name="conent" v-model="request.content" class="form-control" cols="100" rows="5"
                placeholder="Nhập nội dung câu hỏi....."></textarea>
            <button class="btn btn-primary mt-2">Gửi</button>
        </form>
    </div>
</template>
<script>
import SupportService from "@/services/support.service.js";
import AppHeader from "@/components/AppHeader.vue";
import NotifyService from "@/services/notify.service";
import CartService from "@/services/cart.service";
export default {
    data() {
        return {
            supports: [],
            request: {
                userName: sessionStorage.getItem('userName'),
                content: "",
            },
            cartCount: 0,
            notifyCount: 0,
            logined: 0,
        }
    },
    components: {
        AppHeader,
    },
    methods: {
        async getData() {
            try {
                this.supports = await SupportService.findByUser(sessionStorage.getItem("userName"));
                this.supports = this.supports.sort((a, b) => b._id.localeCompare(a._id));
            } catch (error) {
                console.log(error);
            }
        },
        async submit() {
            try {
                await SupportService.create(this.request);
                alert("Câu hỏi của bạn đã được ghi lại");
                this.getData();
            } catch (error) {
                alert("Có lỗi xảy ra, vui lòng thử lại");
            }
        },
        async Delete(id) {
            if (confirm("Bạn có muốn xóa câu trả lời này?")) {
                try {
                    await SupportService.delete(id);
                    this.getData();
                } catch (error) {
                    console.log(error);
                }
            };
        },
        async DeleteAll() {
            if (confirm("Bạn có muốn xóa tất cả câu trả lời?")) {
                try {
                    const result = await SupportService.deleteAll();
                    this.getData();
                } catch (error) {
                    console.log(error);
                }
            };
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