// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Import models
const User = require('./models/User');
const Participant = require('./models/Participant');
const Payment = require('./models/Payment');
const Admin = require('./models/Admin');

// Import config files
const AdminAuth = require('./middleware/adminAuth');
const UserAuth = require('./middleware/userAuth');

// Load env vars
dotenv.config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to DB!'))
    .catch(err => console.log(`DB Connection Error: ${err.message}`));

// Initialize express app
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hi👋🏻 from Team Pixel!'));

app.post('/admin/new', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json('Please enter all fields!');

        bcrypt.hash(password, 10)
            .then(hash => {
                const admin = new Admin({
                    email,
                    password: hash
                });
                admin.save()
                    .then(() => res.send({ message: 'Admin created successfully!' }))
                    .catch(err => res.status(400).json({ error: err.message }));
            })
            .catch(err => res.status(400).json({ error: err.message }));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/admin/login', (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);

        if (!email || !password) return res.status(400).json({ error: 'Please enter all fields!' });

        Admin.findOne({ email })
            .then(admin => {
                if (!admin) return res.status(400).json({ message: 'Admin account not found!' });

                bcrypt.compare(password, admin.password)
                    .then(isMatch => {
                        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

                        jwt.sign({ id: admin._id }, process.env.JWT_SECRET, (err, token) => {
                            if (err) throw err;
                            res.json({ token, admin });
                        });
                    })
                    .catch(err => res.status(400).json({ error: err.message }));
            })
            .catch(err => res.status(400).json({ error: err.message }));
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/user/register', async (req, res) => {
    try {
        const { name, email, college, phone, year, branch } = req.body;

        if (!name || !email || !college || !phone || !year || !branch) return res.status(400).json({ error: 'Please enter all fields!' });

        const prevUser = await User.findOne({ email: email });
        if (prevUser) return res.status(400).json({ error: 'User already registered!' });

        const user = new User({
            name,
            email,
            year,
            branch,
            college,
            phone,
        });

        await user.save();

        console.log('User', user.name, 'registered successfully');

        res.json({ message: 'User registered successfully!' });
    } catch (e) {
        res.status(400).json({ error: e.message });
        console.log(e.message);
    }
});

app.post('/user/participate', async (req, res) => {
    try {
        const { name, email, college, phone, year, branch, event, size } = req.body;

        // console.log(req.body);

        if (!name || !size || !email || !college || !phone || !year || !branch || !event) return res.status(400).json({ error: 'Please enter all fields!' });

        const prevParticipant = await Participant.findOne({ email: email, event: event });
        if (prevParticipant) return res.status(400).json({ error: 'Participant already registered!' });

        const participant = new Participant({
            name,
            email,
            year,
            branch,
            college,
            phone,
            event,
            size: parseInt(size),
        });

        await participant.save();

        console.log('Participant', participant.name, 'registered successfully for', participant.event);

        res.json({ message: 'Participant registered successfully!' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.post('/payment', async (req, res) => {
    try {
        const { razorpay_payment_id, created_at, name, email, year, branch, college, phone, amount, status, event } = req.body;

        if (!userEmail || !event || !razorpay_order_id || !razorpay_payment_id || amount) return res.status(400).json({ error: 'Please enter all fields!' });

        const prevPayment = await Payment.findOne({ paymentId: paymentId });
        if (prevPayment) return res.status(400).json({ error: 'Payment already done!' });

        const payment = new Payment({
            name,
            email,
            year,
            branch,
            college,
            phone,
            event,
            amount,
            created_at,
        });

        await payment.save();

        res.json({ message: 'Payment done successfully!' });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/admin/registrations', AdminAuth, async (req, res) => {
    try {
        const registrations = await User.find({});
        res.json(registrations);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/admin/participants', AdminAuth, async (req, res) => {
    try {
        const participants = await Participant.find({});
        res.json(participants);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.listen(port, () => console.log(`App running on port ${port}!`));
