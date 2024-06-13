require('dotenv').config();
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Token is invalid or has expired' });
    }
};

module.exports = { verifyToken };

