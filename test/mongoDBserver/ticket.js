import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    order_id: String,
    name: String,
    gender: String,
    id_card: String,
    birthdate: Number,
    phone: String,
    visit_date: Number,
    tickets: {
        adult: Number,
        senior: Number,
        child: Number
    },
    amount: Number,                 // 付款金額
    payment_date: Date              // 付款時間
}, {
    collection: 'Bookingmanagement'  // 確保集合名稱是 "Ticket"
});

export const TicketModel = mongoose.model('TicketModel', ticketSchema);
