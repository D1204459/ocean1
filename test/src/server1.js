import express from 'express';
import axios from 'axios';
import cors from 'cors';
import crypto from 'crypto';
import { TicketModel } from "../mongoDBserver/ticket.js";

const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://localhost:5173', 'https://sandbox-web-pay.line.me'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-LINE-ChannelId', 'X-LINE-Authorization-Nonce', 'X-LINE-Authorization'],
}));

app.use(express.json());

const CHANNEL_ID = '2006558114';
const CHANNEL_SECRET = '4c8df56051806d2d84505688d61e7906';
const BASE_URL = 'https://sandbox-api-pay.line.me';

const LINE_NOTIFY_TOKEN = 'hWjHnPlhsnPAQPmjBULRHOpwGUt6JLOy6qziOYAPKSK';
const LINE_NOTIFY_TOKEN1 = 'iaXMDYkMqGL0jfSB3kxg7n9TpuRlKj02QkVj8foMjSP';

function createSignature(requestUrl, requestBody, nonce) {
    const bodyString = JSON.stringify(requestBody);
    const signatureString = CHANNEL_SECRET + requestUrl + bodyString + nonce;
    const hmac = crypto.createHmac('sha256', CHANNEL_SECRET);
    hmac.update(signatureString);
    return hmac.digest('base64');
}

async function sendLineNotify(message) {
    try {
        await Promise.all([
            axios.post(
                'https://notify-api.line.me/api/notify',
                new URLSearchParams({ message }),
                {
                    headers: {
                        'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            ),
            axios.post(
                'https://notify-api.line.me/api/notify',
                new URLSearchParams({ message }),
                {
                    headers: {
                        'Authorization': `Bearer ${LINE_NOTIFY_TOKEN1}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
        ]);
        console.log('LINE Notify 發送成功');
    } catch (error) {
        console.error('LINE Notify 發送失敗:', error);
        console.error('錯誤詳情:', error.response?.data);
    }
}

app.post('/create-payment', async (req, res) => {
    try {
        const { amount, orderInfo } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount', message: '金額無效' });
        }

        const nonce = Date.now().toString();
        const requestUrl = '/v3/payments/request';
        const orderId = `order-${Date.now()}`;

        const requestBody = {
            amount,
            currency: 'TWD',
            orderId,
            packages: [
                {
                    id: 'package-1',
                    amount,
                    name: '票券訂購',
                    products: [
                        {
                            name: '票券',
                            quantity: 1,
                            price: amount,
                        },
                    ],
                },
            ],
            redirectUrls: {
                confirmUrl: 'http://localhost:5173/confirm',
                cancelUrl: 'http://localhost:5173/cancel',
            },
        };

        const signature = createSignature(requestUrl, requestBody, nonce);

        const response = await axios.post(`${BASE_URL}${requestUrl}`, requestBody, {
            headers: {
                'X-LINE-ChannelId': CHANNEL_ID,
                'X-LINE-Authorization-Nonce': nonce,
                'X-LINE-Authorization': signature,
                'Content-Type': 'application/json',
            },
        });

        console.log('LINE Pay Response:', response.data);

        const paymentUrl = response.data?.info?.paymentUrl?.web;
        if (!paymentUrl) {
            throw new Error('無法從 LINE Pay 取得付款 URL');
        }

        res.json({
            paymentUrl,
            orderId,
            transactionId: response.data.info.transactionId
        });
    } catch (error) {
        console.error('LINE Pay Error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Payment request failed',
            message: '建立付款請求失敗：' + (error.response?.data?.message || error.message),
        });
    }
});

// 儲存票券資訊（創建訂單時）
app.post('/save-ticket-info', async (req, res) => {
    try {
        const birthdate = new Date(req.body.birthdate).getTime(); // 儲存時間戳
        const visit_date = new Date(req.body.visitDate).getTime(); // 儲存時間戳

        if (isNaN(birthdate) || isNaN(visit_date)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format for birthdate or visit_date'
            });
        }

        const newTicket = new TicketModel({
            order_id: req.body.orderId,
            name: req.body.name,
            gender: req.body.gender,
            id_card: req.body.id_card,
            birthdate: birthdate, // 儲存時間戳
            phone: req.body.phone,
            visit_date: visit_date, // 儲存時間戳
            tickets: req.body.tickets,
        });

        await newTicket.save();
        res.json({
            success: true,
            message: 'Ticket information saved successfully'
        });
    } catch (error) {
        console.error('Error saving ticket information:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save ticket information',
            message: error.message
        });
    }
});


app.get('/confirm', async (req, res) => {
    try {
        const { transactionId, orderId, amount } = req.query;
        console.log('接收到付款確認請求:', { transactionId, orderId, amount });
        const nonce = Date.now().toString();
        const requestUrl = `/v3/payments/${transactionId}/confirm`;

        const requestBody = {
            amount: parseInt(amount),
            currency: 'TWD'
        };

        const signature = createSignature(requestUrl, requestBody, nonce);

        const response = await axios.post(
            `${BASE_URL}${requestUrl}`,
            requestBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-LINE-ChannelId': CHANNEL_ID,
                    'X-LINE-Authorization-Nonce': nonce,
                    'X-LINE-Authorization': signature
                }
            }
        );

        console.log('LINE Pay 確認回應:', response.data);

        if (response.data.returnCode === '0000') {
            const notifyMessage = `
🎫 訂單完成通知 🎫
----------------
訂單編號: ${orderId}
付款金額: NT$ ${amount}
交易時間: ${new Date().toLocaleString('zh-TW')}
----------------
感謝您的購買！`;
            await sendLineNotify(notifyMessage);
        }

        // 回傳成功給前端
        res.json({
            success: true,
            orderId: orderId,
            transactionId: transactionId,
            paymentStatus: response.data.returnCode,
            message: '資料儲存成功'
        });

    } catch (error) {
        console.error('確認付款時發生錯誤:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: 'Payment confirmation failed',
            message: error.response?.data?.message || error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});