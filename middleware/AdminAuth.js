const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const AdminAuth = async (req, res, next) => {
    try {
        const { authorization = '' } = req.headers;
        const [bearer, token] = authorization?.split(' ');

        if (!token) {
            return res.status(401).json({ message: "No Authentication Token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return res.send(403).json({ message: "Admin not found" });
        }
        req.admin = admin;
        next();
    }
    catch (e) {
        res.status(401).json({ error: e.message, message: "Not Authenticated" });
    }
}

module.exports = AdminAuth;