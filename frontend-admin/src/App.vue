<script>
import AppHeader from "@/components/AppHeader.vue";
export default {
    components: {
        AppHeader,
    },
};
</script>

<template>
    <div class="container">
        <div class="row mt-4">
            <AppHeader class="col-2 border-end" />
            <router-view class="col" />
        </div>
    </div>
</template>
