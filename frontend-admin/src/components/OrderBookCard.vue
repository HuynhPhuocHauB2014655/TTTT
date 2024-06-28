<template>
    <li v-for="item in books" :key="item.bookId" class="list-group-item ms-5 row">
        <div class="row">
            <router-link :to="{ name: 'bookinfo', params: { bookId: item.bookId } }" class="col"><img class="img-fluid"
                    style="height: 50px; width: 50px; margin: 0 auto;" :src="item.hinh"
                    :alt="item.tensach"></router-link>
            <p class="col">{{ item.tensach }}</p>
            <p class="col">{{ item.price }}</p>
            <p class="col">{{ item.quantity }}</p>
            <p class="col">{{ item.price * item.quantity }}</p>
        </div>
    </li>
</template>
<script>
export default {
    props: {
        books: { type: Array, required: true },
        index: { type: Number, required: true }
    },
}
</script>