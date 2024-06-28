<script>
export default {
   props: {
       book: { type: Object, required: true },
   },
    computed: {
        formatPrice() {
            return  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.book.gia);
        }
    },

};
</script>

<template>
   <div class="row border p-2 rounded">
       <div class="col-4">
            <img :src="book.hinh" style="width: 100%;" />
        </div>
        <div class="col-8">
            <div class="p-1">
                <strong>Tên:</strong>
                {{ book.tensach }}
            </div>
            <div class="p-1">
                <strong>Thể loại:</strong>
                {{ book.theloai }}
            </div>
            <div class="p-1">
                <strong>Số trang:</strong>
                {{ book.sotrang }}
            </div>
            <div class="p-1">
                <strong>Nhà xuất bản:</strong>
                {{ book.nxb }}
            </div>
            <div class="p-1" >
                <strong>Giá:</strong>
                {{ formatPrice }}
            </div>
            <div class="p-1">
                <strong>Số quyển:</strong>
                {{ book.soquyen }}
            </div>
        </div>
       
   </div>
</template>