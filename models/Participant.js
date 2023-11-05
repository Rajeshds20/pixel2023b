
const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
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
        default: 'not paid'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    team: {
        type: Array,
        default: [],
    }
});

const Participant = mongoose.model('Participant', participantSchema);

module.exports = Participant;
