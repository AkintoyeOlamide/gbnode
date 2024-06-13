const { Router } = require('express');
const { User } = require('../models/User');
const { PaymentInfo } = require('../models/PaymentInfo');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const route = Router();
const crypto = require('crypto');
const axios = require('axios');
const transaction = require('paystack/resources/transaction');
const paystack = require('paystack')(`${process.env.PAYSTACK_SECRET_KEY}`);


const verifyCard = async (req, res) => {
    try {
        const bin = req.params?.bin;
        const response = await axios.get(`https://api.paystack.co/decision/bin/${bin}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.log({ error: error.response.data }, 'ERROR_VERIFYING_CARD_BIN');
        return res.status(500).json({ error: error.response.data });
    }
};

const chargeCard = async (req, res) => {
    try {
        const { email, amount, card } = req.body;

        const response = await paystack.transaction.charge({
            email,
            amount,
            card,
        });

        return res.status(200).json(response);
    } catch (error) {
        console.error('Error charging card:', error);
        res.status(500).json(error);
    }
};

const initializePayment = async (req, res) => {
    try {
        const { amount, email,callback_url } = req.body;
        console.log(req.body, 'we')
        const headers = {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
        const response = await axios.post('https://api.paystack.co/transaction/initialize', { email, amount, callback_url }, { headers });
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error, 'ERROR_INITIALIZING_PAYMENT');
        return res.status(500).json(error);
    }
};

// const verifyPayment = async (req, res) => {
//     try {
//         const reference = req.params.reference;
//         const options = {
//             method: 'GET',
//             url: `https://api.paystack.co/transaction/verify/${reference}`,
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
//             }
//         };

//         const response = await axios(options);
//         const data = response?.data?.data;

//         const ifAuthCodeExists = await PaymentInfo.findOne({ authorization_code: data?.authorization?.authorization_code });
//         const transaction = ifAuthCodeExists?.transactions?.find(transaction => transaction?.reference === reference);

//         if (!transaction) {
//             const paymentInfo = await PaymentInfo.create({
//                 authorization_code: data?.authorization?.authorization_code,
//                 emailAssociated: data?.customer?.email,
//                 cardInfo: data?.authorization,
//                 customerInfo: data?.customer,
//                 transactions: [
//                     {
//                         reference: data?.reference,
//                         amount: data?.amount,
//                         timeOfTransaction: data?.transaction_date
//                     }
//                 ],
//                 userId: 1,
//             });
//             return res.status(200).json(paymentInfo);
//         } else {
//             ifAuthCodeExists?.transactions?.push({
//                 reference: data?.reference,
//                 amount: data?.amount,
//                 timeOfTransaction: data?.transaction_date
//             });
//             const updatedPaymentInfo = await ifAuthCodeExists.save();
//             return res.status(200).json(updatedPaymentInfo);
//         }

//         // res.json(response.data);
//         // res.status(200).json({ paymentInfo, data: response?.data });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while verifying the transaction' });
//     }
// };

const verifyPayment = async (req, res) => {
    try {
        const reference = req.params.reference;
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const data = response?.data?.data;

        let paymentInfo;

        const existingPaymentInfo = await PaymentInfo.findOne({
            where: {
                authorization_code: data?.authorization?.authorization_code
            }
        });

        const transactionExists = existingPaymentInfo?.transactions?.some(transaction => transaction?.reference === reference);

        if (!transactionExists) {
            paymentInfo = await PaymentInfo.create({
                authorization_code: data?.authorization?.authorization_code,
                emailAssociated: data?.customer?.email,
                cardInfo: data?.authorization,
                customerInfo: data?.customer,
                transactions: [
                    {
                        reference: data?.reference,
                        amount: data?.amount,
                        timeOfTransaction: data?.transaction_date
                    }
                ],
                userId: 1,
            });
        } else {
            existingPaymentInfo.transactions.push({
                reference: data?.reference,
                amount: data?.amount,
                timeOfTransaction: data?.transaction_date
            });
            paymentInfo = await existingPaymentInfo.save();
        }

        res.status(200).json(paymentInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while verifying the transaction' });
    }
};

const chargeAuthorization = async (req, res) => {
    try {
        const { authorization_code, email, amount } = req.body;
        console.log({
            authorization_code,
            email,
            amount,
        });

        const options = {
            method: 'POST',
            url: `https://api.paystack.co/transaction/charge_authorization`,
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            data: {
                authorization_code,
                email,
                amount,
            }
        };

        const response = await axios(options);
        res.json(response.data);
    } catch (error) {
        // console.error(error);
        res.status(500).json({ error: 'An error occurred while verifying the transaction' });
    }
};

module.exports = {
    verifyCard,
    chargeCard,
    initializePayment,
    verifyPayment,
    chargeAuthorization,
};