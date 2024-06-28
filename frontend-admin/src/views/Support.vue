<template>
    <div>
        <h1>Hỗ trợ</h1>
        <div v-if="!supports.length">
            Không có câu hỏi nào
        </div>
        <div v-else>
            <p>Danh sách câu hỏi</p>
            <div class="list-group">
                <div class="list-group-item list-group-item-action" v-for="req in supports" :key="req._id">
                    <div class="d-flex justify-content-between">
                        <div>
                            Câu hỏi: {{ req.content }}
                        </div>
                        <div v-if="!req.response" class="text-danger" @click="showResponse(req._id)">
                            <button class="btn btn-sm btn-outline-danger">Trả lời</button>
                        </div>
                        <div v-else class="text-success" @click="showResponse(req._id)">
                            Đã phản hồi
                        </div>
                    </div>
                    <div v-if="show == req._id">
                        <div v-if="!req.response">
                            <div>Trả lời:</div>
                            <textarea name="response" cols="100" rows="3" v-model="support.response"
                                class="form-control mb-2"></textarea>
                            <button class="btn btn-primary" @click="Response(req._id)">Lưu</button>
                        </div>
                        <div v-else>
                            Trả lời: {{ req.response }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import SupportService from "@/services/support.service.js";
export default {
    data() {
        return {
            supports: [],
            show: "",
            support: {
                id: "",
                response: "",
            }
        }
    },
    methods: {
        async getSupportData() {
            try {
                this.supports = await SupportService.findAll();
                this.supports = this.supports.sort((a, b) => b._id.localeCompare(a._id))
            } catch (error) {
                console.log(error);
            }
        },
        showResponse(id) {
            if (this.show === id) {
                this.show = "";
            }
            else {
                this.show = id;
            }
        },
        async Response(id) {
            this.support.id = id;
            try {
                const res = await SupportService.update(this.support);
                alert("Đã phản hồi thành công!");
                this.show = "";
                this.getSupportData();
            } catch (error) {
                console.log(error);
            }
        }
    },
    created() {
        this.getSupportData();
    }
}
</script>