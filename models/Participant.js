
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'not paid'],
        default: 'paid'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    size: {
        type: Number,
        required: true
    }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
