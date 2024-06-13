const { Router } = require('express');
const route = Router();
const {
    verifyCard,
    chargeCard,
    initializePayment,
    verifyPayment,
    chargeAuthorization,
} = require('../controllers/payment');

route.get('/', (req, res) => res.sendStatus(200));
route.get('/verifyCard/:bin', verifyCard);
route.post('/chargeCard', chargeCard);
route.post('/initializePayment', initializePayment);
route.get('/verifyPayment/:reference', verifyPayment);
route.post('/chargeAuthorization', chargeAuthorization);

module.exports = route;