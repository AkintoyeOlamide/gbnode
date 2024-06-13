const { Onboarding } = require('../models/Onboarding');

const onboardingStage1 = async (req, res) => {
    try {
        const stage1 = await Onboarding.create({ ...req.body, userId: req.user.id });
        if (stage1) {
            res.status(200).json('Stage 1 is successfull');
        }
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
}

const onboardingStage2 = async (req, res) => {
    try {
        const onboarding = await Onboarding.findOne({ where: { userId: req.user.id } });
        if (!onboarding) {
            return res.status(400).json({ error: `onboarding information doesnt exist for ${req.user.name}` })
        }
        await onboarding.update(req.body);
        res.status(200).json('Stage 2 is successfull');
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
}

const onboardingStage3 = async (req, res) => {
    try {
        const onboarding = await Onboarding.findOne({ where: { userId: req.user.id } });
        if (!onboarding) {
            return res.status(400).json({ error: `onboarding information doesnt exist for ${req.user.name}` })
        }
        await onboarding.update(req.body);
        res.status(200).json('Stage 3 is successfull');
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
}

const onboardingStage4 = async (req, res) => {
    try {
        const onboarding = await Onboarding.findOne({ where: { userId: req.user.id } });
        if (!onboarding) {
            return res.status(400).json({ error: `onboarding information doesnt exist for ${req.user.name}` })
        }
        await onboarding.update(req.body);
        res.status(200).json('Stage 4 is successfull');
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
}

const onboardingStage5 = async (req, res) => {
    try {
        const onboarding = await Onboarding.findOne({ where: { userId: req.user.id } });
        if (!onboarding) {
            return res.status(400).json({ error: `onboarding information doesnt exist for ${req.user.name}` })
        }
        await onboarding.update(req.body);
        res.status(200).json('Stage 5 is successfull');
    } catch (error) {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
}

module.exports = {
    onboardingStage1,
    onboardingStage2,
    onboardingStage3,
    onboardingStage4,
    onboardingStage5,
}