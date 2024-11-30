
import { createApp } from 'vue'

import App from './App.vue'


import router from './router'



const app = createApp(App); // 創建應用實例;
app.use(router); // 使用 Vue Router
app.mount('#app');
// 添加調試代碼
/*router.beforeEach((to, from) => {
    console.log('路由變化:', to.path);
});*/

/*
import App1 from "@/App1.vue";

createApp(App1).mount('#app') // 將 App1.vue 掛載到 #app1*!/*/

