<template>
    <div>
        <div class="fs-5 ms-3 mb-3">
            <a href="/" class="nav-link">Quản lý sách</a>
        </div>
        <div class="list-group list-group-flush">
            <router-link :to="{ name: 'homeBook' }" class="nav-link list-group-item list-group-item-action">
                Quản lý sách
                <i class="fas fa-book"></i>
            </router-link>
            <router-link :to="{ name: 'notification' }" class="nav-link list-group-item list-group-item-action">
                Thông báo
                <i class="fas fa-bell"></i>
            </router-link>
            <router-link :to="{ name: 'revenue' }" class="nav-link list-group-item list-group-item-action">
                Doanh thu
                <i class="fas fa-dollar"></i>
            </router-link>
            <router-link :to="{ name: 'orderconfirm' }" class="nav-link list-group-item list-group-item-action">
                Đơn hàng
                <i class="fa-solid fa-box"></i>
            </router-link>
            <router-link :to="{ name: 'support' }" class="nav-link list-group-item list-group-item-action">
                Hỗ trợ
                <i class="fa-regular fa-envelope"></i>
            </router-link>
        </div>
    </div>
</template>