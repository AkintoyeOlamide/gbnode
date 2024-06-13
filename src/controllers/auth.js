const { Router } = require('express');
const { User } = require('../models/User');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const route = Router();
const crypto = require('crypto');
const axios = require('axios');
const paystack = require('paystack')(`${process.env.PAYSTACK_SECRET_KEY}`);

const signUp = async (req, res) => {
    try {
        const { name, email, password, country, state } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (!existingUser) {
            const otp = Math.floor(100000 + Math.random() * 900000);
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = crypto
                .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
                .toString('hex');
            const newUser = await User.create({ name, email, password: passwordHash, salt, otp, country, state });

            if (newUser.id) {
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT,
                    secure: true,
                    auth: {
                        user: process.env.MAIL,
                        pass: process.env.MAIL_PASSWORD,
                    },
                });

                const mailOptions = {
                    from: 'olalekan.animashaun@theyutes.com',
                    to: email,
                    subject: 'Your OTP for User Registration',
                    text: `Your OTP: ${otp}`,
                };

                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ error: 'Failed to send OTP email' });
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                return res.status(201).json({ success: true, user: newUser });
            } else {
                return res.status(500).json({
                    success: false,
                    message: 'Failed. Please try again later.',
                });
            }
        } else {
            console.log('Email already exists');
            return res.status(400).json({
                success: false,
                message: 'Email already exists! Please try password reset.',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (otp === user.otp) {
            user.otpVerified = true;
            await user.update({ otp: null });
            await user.save();

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

            return res.json({
                message: 'OTP verified',
                token,
                user: {
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                }
            });
        } else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newOTP = Math.floor(100000 + Math.random() * 900000);

        user.otp = newOTP;
        user.otpVerified = false;
        await user.save();

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: 'olalekan.animashaun@theyutes.com',
            to: email,
            subject: 'Your OTP for User Registration',
            text: `Your OTP: ${newOTP}`,
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to send OTP email' });
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        return res.json({ message: 'New OTP sent for password reset' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyResetPassword = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(otp, email, 'otp');

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (otp === user.otp) {
            console.log(user.otp, otp, 'gwarn')
            user.otpVerified = true;
            await user.update({ otp: null });
            await user.save();

            // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'OTP verified',
            });
        } else {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { password, email } = req.body;
        if (password === undefined || email === undefined) {
            return res.status(500).json({ error: "password and email cant be undefined" })
        }

        const user = await User.findOne({ where: { email } });

        if (!user.otpVerified) {
            return res.status(500).json({ error: "verify otp" })
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const passwordHash = crypto
            .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
            .toString('hex');

        user.password = passwordHash;
        user.salt = salt;

        await user.save()
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.
            status(200).
            json({
                success: 'password has been successfully reset',
                token,
                user: {
                    name: user.name,
                    phone: user.phone,
                    balance: user.balance,
                    email: user.email,
                }
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "unable to reset password" })
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'User doesnt exist' });
        }

        if (!user.otpVerified) {
            return res.status(401).json({ message: 'OTP not verified. Please verify OTP first.' });
        }

        const hashedPassword = crypto
            .pbkdf2Sync(password, user.salt, 1000, 64, 'sha256')
            .toString('hex');

        if (hashedPassword !== user.password) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
            user: {
                name: user.name,
                phone: user.phone,
                balance: user.balance,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    signUp,
    verifyOtp,
    forgotPassword,
    verifyResetPassword,
    resetPassword,
    login,
};