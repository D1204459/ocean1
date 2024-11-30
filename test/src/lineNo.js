/*
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// 設定 CORS 配置
const corsOptions = {
    origin: " http://localhost:5173/", // 這裡請替換為您的前端 URL
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization"
};
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST 路由 /send-notify
app.post('/send-notify', async (req, res) => {
    const message = req.body.message; // 從請求中取得訊息
    console.log("Received message:", message); // 調試：檢查伺服器接收到的訊息
    const tokens = [
        'hWjHnPlhsnPAQPmjBULRHOpwGUt6JLOy6qziOYAPKSK', // 韋翔 LINE Notify 權杖
        'iaXMDYkMqGL0jfSB3kxg7n9TpuRlKj02QkVj8foMjSP'  // 泓達 LINE Notify 權杖
    ];    const apiUrl = 'https://notify-api.line.me/api/notify';

    try {
        // 遍歷每個 token 並發送相同的訊息
        for (let token of tokens) {
            await axios.post(apiUrl, new URLSearchParams({ message }), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        }
        res.status(200).send({ status: 'success' });
    } catch (error) {
        console.error('發送 LINE Notify 訊息時出錯:', error);
        res.status(500).send({ status: 'failed' });
    }
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
*/
