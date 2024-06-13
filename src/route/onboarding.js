const Router = require('express');
const route = Router();
const { verifyToken } = require('../helpers/middleware');
const {
    onboardingStage1,
    onboardingStage2,
    onboardingStage3,
    onboardingStage4,
    onboardingStage5
} = require('../controllers/onboarding');

route.post('/step1', verifyToken, onboardingStage1);
route.post('/step2', verifyToken, onboardingStage2);
route.post('/step3', verifyToken, onboardingStage3);
route.post('/step4', verifyToken, onboardingStage4);
route.post('/step5', verifyToken, onboardingStage5);