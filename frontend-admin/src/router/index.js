import { createWebHistory, createRouter } from "vue-router";
import HomeBook from "@/views/HomeBook.vue";

const routes = [
    {
        path: "/",
        name: "homeBook",
        component: HomeBook,
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },
    {
        path: '/notify',
        name: 'notification',
        component: ()=> import('@/views/Notify.vue')
    },
    {
        path:'/revenue',
        name: 'revenue',
        component: () => import('@/views/Revenue.vue'),
    },
    {
        path: "/bookinfo/:bookId",
        name: "bookinfo",
        component: () => import("@/views/BookInfo.vue"),
        props: true,
    },
    {
        path:'/order',
        name: 'orderconfirm',
        component: () => import('@/views/OrderConfirm.vue'),
    },
    {
        path:'/support',
        name: 'support',
        component: () => import('@/views/Support.vue'),
    },

];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;