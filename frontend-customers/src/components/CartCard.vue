<template>
    <tr>
        <td>
            <img class="img-fluid p-2" :src="cart.hinh" alt="" style="height: 100px; width: 100px; margin: 0 auto;">
        </td>
        <td>
            {{ cart.tensach }}
        </td>
        <td>
            {{ cart.price }}
        </td>
        <td v-if="!change && book.soquyen > 0">
            {{ cart.quantity }}
        </td>
        <td v-else-if="change && book.soquyen > 0">
            <input type="number" class="form-control" inputmode="numeric" v-model="cart.quantity"  style="width: 60px;" min="1">
        </td>
        <td v-else class="text-danger">Đã hết hàng</td>
        <td>
            {{ cart.quantity * cart.price}}
        </td>
        <td>
            <div v-if="!change">
                <button class="btn btn-sm btn-outline-danger me-2" @click="removeFromCart(cart.bookId)">Xóa</button>
                <button  class="btn btn-sm btn-outline-primary" @click="changeCart">Sửa</button>
            </div>
            <div v-else>
                <button  class="btn btn-sm btn-outline-primary me-2" @click="editCard()">Lưu</button>
                <button  class="btn btn-sm btn-outline-danger" @click="cancelChange">Bỏ</button>
            </div>
        </td>
    </tr>
</template>
<style>
td {
    vertical-align: middle;
}
</style>
<script>
import BookService from "@/services/book.service";
import CartService from "@/services/cart.service";
export default {
    props:{
        cart:{ type: Object, required: true,},
    },
    emits:["cart:change"],
    data(){
        return{
            change:false,
            user:"",
            cartChange:0,
            book:{},
        }
    },
    methods:{
        async getBook(){
            try{
                this.book = await BookService.get(this.cart.bookId);
            }catch(error)
            {
                console.log(error);
            }
        },
        changeCart()
        {
            this.change = true;
            this.cartChange = this.cart.quantity;
        },
        cancelChange(){
            if(confirm("Bạn có chắc muốn hủy bỏ lần sửa này?"))
            {
                this.change = false;
            }
        },
        async editCard(){
            try{
                await CartService.update(this.user,this.cart);
                this.$emit("cart:change");
            }catch(error){
                alert("Cập nhật thất bại");
            }
            this.change = false;
        },
        async removeFromCart(id){
            if(confirm("Bạn có chắc muốn xóa sách này?"))
            {
                try
                {
                    const result = await CartService.delete(this.user,id);
                    console.log(result);
                    this.$emit("cart:change");
                }
                catch(error){
                    alert('Xóa không thành công');
                }
            }
        }
    },
    created(){
        this.getBook();
        this.user = sessionStorage.getItem("userName") ? sessionStorage.getItem("userName") : sessionStorage.getItem("guest");
    }
}
</script>