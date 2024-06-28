<template>
    <select class="form-select" v-model="publisherC" @change="onChange">
        <option value="" selected>Chọn nhà xuất bản</option>
        <option v-for="(publisher, index) in publishers" :value="publisher" :key="index">
            {{ publisher }}
        </option>
    </select>
</template>
<script>
import BookService from "@/services/book.service";
export default {
    data() {
        return {
            publishers: [],
            books: [],
            publisherC: ""
        };
    },
    emits: ["choose:publisher"],
    methods: {
        async getBook() {
            try {
                this.books = await BookService.getAll();
                this.getPublisher();
            } catch (error) {
                console.log(error);
            }  
        },
        getPublisher() {
            let i = 0;
            for( i; i <= this.books.length; i++) {
                const publisher = this.books[i].nxb;
                if(!(this.publishers.includes(publisher)))
                    this.publishers.push(publisher);
            }
        },
        onChange(){
            this.$emit('choose:publisher', this.publisherC);
        }
        
    },
    mounted() {
            this.getBook();
    }
}
    
</script>