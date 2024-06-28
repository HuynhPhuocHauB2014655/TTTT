<template>
    <form @submit="submitForm">
        <div class="form-group">
            <label for="title">Tiêu đề thông báo:</label>
            <input
                name="title"
                type="text"
                class="form-control"
                v-model="notify.title"
            />
        </div>
        <div class="form-group">
            <label for="content">Nội dung thông báo:</label>
            <textarea
                name="content"
                class="form-control"
                rows="3"
                v-model="notify.content"
            >
            </textarea>
        </div>
        <div class="form-group">
            <label for="selectUser">Chọn khách hàng cần thông báo:</label>
            <select multiple class="form-control" id="selectUser" v-model="selectedUsers">
                <option    
                    v-for="(user, index) in this.users" :key="index" :value="user._id"
                >
                    {{ user.hoten }}
                </option>
            </select>
        </div>
        <div class="form-group">
            <input class="form-checkox-input mx-2" type="checkbox" id="all"  @change="checkedAll"/>
            <label class="form-check-label" for="all">Chọn tất cả</label>
        </div>
    </form>
    <div class="form-group">
            <button class="btn btn-primary" @click="submitForm">Gửi</button>
    </div>
</template>
<script>
    import CustomerService from "@/services/customer.service";
    import NotifyService from "@/services/notify.service";
    export default {
        data(){
            return {
                users: [],
                selectedUsers: [],
                check: false,
                notify: { title: null, content: null, username: null },
                i: 0,
            }
        },
        methods: {
            async  getAllCustomer() {
                try {
                    this.users = await CustomerService.getAll();
                } catch (error) {
                    console.log(error);
                }  
            },
            async submitForm() {
                if(this.check ){
                    for(this.i = 0; this.i < this.users.length ; this.i++) {
                        this.notify.username = this.users[this.i]._id;
                        try {
                            await NotifyService.create(this.notify);
                            alert("Them thong bao thanh cong");
                        } catch (error) {
                            console.error("Error:", error);
                        }
                    }
                }else {
                    for(this.i = 0; this.i < this.selectedUsers.length ; this.i++) {
                        this.notify.username = this.selectedUsers[this.i];
                        try {
                            await NotifyService.create(this.notify);
                            alert("Them thong bao thanh cong");
                        } catch (error) {
                            console.error("Error:", error);

                        }
                    }
                }
            },
            checkedAll() {
                return this.check = true;
            }
        },
        created() {
            this.getAllCustomer();
            this.check = false
            this.i = 0
        }
    };
</script>   