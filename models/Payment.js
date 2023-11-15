
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'done'
    },
    event: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
    },
    userEmail: {
        type: String,
        required: true
    },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
