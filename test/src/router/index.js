
import { createRouter, createWebHistory } from 'vue-router';
import Ticket from '@/views/Ticketpurchase.vue';
import Onlinebookingsystem from '@/views/Onlinebookingsystem.vue';

const routes = [
    {
        path: '/',
        name: 'TicketPurchase',
        component: Ticket
    },
    {
        path: '/Online',
        name: 'Onlinebookingsystem',
        component: Onlinebookingsystem,
    },
    {
        path: '/confirm',
        component: Onlinebookingsystem, // 使用同一個組件
        props: route => ({        // 通過 props 傳遞參數
            transactionId: route.query.transactionId,
            orderId: route.query.orderId
        })
    }


];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;


/*
import App from '../App2.vue';
import App1 from '../App1.vue'; // 引入 App1.vue

const routes = [
    {
        path: '/',
        name: 'home',
        component: App, // 設定根路由顯示 App2.vue
    },
    {
        path: '/payment', // 設定跳轉的路徑
        name: 'payment',
        component: App1 // 設定當路徑為 /payment 時顯示 App1.vue
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
*/
