<template>
    <select class="form-select" v-model="typeC" @change="onChange">
        <option value="" selected>Chọn thể loại</option>
        <option v-for="(type, index) in types" :value="type" :key="index">{{ type }}</option>
    </select>
</template>
<script>
import BookService from "@/services/book.service";
export default {
    data() {
        return {
            types: [],
            books: [],
            typeC: ""
        }
    },
    emits: ["choose:type"],
    methods: {
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
                this.getTypes();
            } catch (error) {
                console.log(error);
            }
        },
        getTypes() {
            let i = 0;
            for( i; i <= this.books.length; i++) {
                const type = this.books[i].theloai;
                if(!(this.types.includes(type)))
                    this.types.push(type);
                
            }
        },
        onChange() {
            this.$emit("choose:type", this.typeC);
        }

    },
    created() {
        this.retrieveBooks();
    }
}
</script>