<script>
    export default {
        props: {
            books: { type: Array, default: []},
            activeIndex: {type: Number, default: -1},
        },
        emits: ["update:activeIndex"],
        methods: {
            updateActiveIndex(index) {
                this.$emit("update:activeIndex", index);
            }
        }        
    };
</script>

<template>
    <ul class="list-group" style="height: 350px;overflow: auto;">
        <li 
            class="list-group-item"
            v-for="(book, index) in books"
            :key="book.id"
            :class="{ 'active': index === activeIndex}"
            @click="updateActiveIndex(index)"
        >
            {{ book.tensach }}
        </li>
    </ul>
</template>