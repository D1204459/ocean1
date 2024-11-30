// 引入必要的套件
import express from 'express';
import mongoose from 'mongoose';
// 初始化 express 應用
const app = express();

// 設定 port
const port = 5000;

// 使用 JSON 解析中介軟體
app.use(express.json());

// 設定 MongoDB 連接字串
const connectionString = 'mongodb+srv://d1204360:PnyNLvZ0DV0Kz1kK@fcmbmcluster.hxriy.mongodb.net/Fengjia_mbm?retryWrites=true&w=majority';

// 連接 MongoDB
mongoose.connect(connectionString, {
})
    .then(() => {
        console.log('MongoDB Atlas connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// 設定一個簡單的測試路由
app.get('/', (req, res) => {
    res.send('Hello from MongoDB server!');
});

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
