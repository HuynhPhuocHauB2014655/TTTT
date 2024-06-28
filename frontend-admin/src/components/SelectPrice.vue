<template>
    <select class="form-select" v-model="price" @change="onChange">
        <option value="0"selected >Chọn mức giá</option>
        <option value="1">Dưới 10000</option>
        <option value="2">10000 - 30000</option>
        <option value="3">30000 - 100000</option>
        <option value="4">Trên 100000</option>
    </select>
</template>
<script>
export default {
    data() {
        return {
            books: [],
            price: 0
        }
    },
    emits: ['choose:price'],
    methods: {
        async getBook() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.log(error);
            }  
        },
        onChange(){
            this.$emit('choose:price', this.price);
        }
    }
}
</script>