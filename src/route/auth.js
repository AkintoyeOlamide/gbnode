const { Router } = require('express');
const route = Router();
const {
    signUp,
    verifyOtp,
    forgotPassword,
    verifyResetPassword,
    resetPassword,
    login,
} = require('../controllers/auth');

route.post('/create', signUp);
route.post('/verifyOtp', verifyOtp);
route.post('/forgotPassword', forgotPassword);
route.post('/verifyResetPassword', verifyResetPassword);
route.post('/resetPassword', resetPassword);
route.post('/login', login);

module.exports = route;