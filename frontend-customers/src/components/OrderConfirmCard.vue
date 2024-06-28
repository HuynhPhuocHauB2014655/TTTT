<template>
    <tr>
        <td class="text-center">
            {{ index + 1 }}
        </td>
        <td>
            <img class="img-fluid p-2" :src="order.hinh" alt="" style="height: 100px; width: 100px;">
        </td>
        <td>
            {{ order.tensach }}
        </td>
        <td>
            {{ order.gia }}
        </td>
        <template v-if="order.quantity">
            <td >{{ order.quantity }}</td>
            <td >{{ order.quantity * order.price}}</td>
        </template>
        <template v-else>
            <td >{{ quantity }}</td>
            <td >{{order.gia}}</td>
        </template>
    </tr>
</template>
<style>
td {
    vertical-align: middle;
}
</style>
<script>
export default {
    props:{
        order:{ type: Object ,required:true,},
        index :{type: Number ,required:true },
        quantity:{type: Number ,default: 1 }
    },
}
</script>