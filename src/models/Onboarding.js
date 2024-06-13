const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Onboarding = sequelize.define('Onboarding', {
    businessAndMarketingGoals: {
        type: DataTypes.JSON,
        defaultValue: {
            primaryBusinessObjective: '',
            targetAudience: '',
            campaignSuccess: '',
        },
        validate: {
            isValidStructure(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('businessAndMarketingGoals must be a non-null object');
                }

                const requiredKeys = ['primaryBusinessObjective', 'targetAudience', 'campaignSuccess'];

                for (const key of requiredKeys) {
                    if (!(key in value)) {
                        throw new Error(`Missing required key: ${key}`);
                    }

                    if (typeof value[key] !== 'string') {
                        throw new Error(`The value of ${key} must be a string`);
                    }
                }
            }
        },
    },
    technicalAndFeatureUse: {
        type: DataTypes.JSON,
        defaultValue: {
            familiarity: '',
            mostInterestedFeature: '',
            specificChallenges: '',
        },
        validate: {
            isValidStructure(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('technicalAndFeatureUse must be a non-null object');
                }

                const requiredKeys = ['familiarity', 'mostInterestedFeature', 'specificChallenges'];

                for (const key of requiredKeys) {
                    if (!(key in value)) {
                        throw new Error(`Missing required key: ${key}`);
                    }

                    if (key === 'familiarity') {
                        const validFamiliarityValues = ['high', 'medium', 'low'];
                        if (!validFamiliarityValues.includes(value[key])) {
                            throw new Error(`The value of familiarity must be one of ${validFamiliarityValues.join(', ')}`);
                        }
                    } else if (key === 'mostInterestedFeature') {
                        const validFeatureValues = ['Organizing posts', 'A.I. Tools for Captions & Content Ideas', 'Education'];
                        if (!validFeatureValues.includes(value[key])) {
                            throw new Error(`The value of mostInterestedFeature must be one of ${validFeatureValues.join(', ')}`);
                        }
                    } else if (key === 'specificChallenges') {
                        if (typeof value[key] !== 'string') {
                            throw new Error(`The value of ${key} must be a string`);
                        }
                    }
                }
            }
        },
    },
    integrationAndCompatibility: {
        type: DataTypes.JSON,
        defaultValue: {
            usingMarketingSoftware: '',
            noOfTeamMembers: '',
            workflowForInstagramContent: '',
        },
        validate: {
            isValidStructure(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('integrationAndCompatibility must be a non-null object');
                }

                const requiredKeys = ['usingMarketingSoftware', 'noOfTeamMembers', 'workflowForInstagramContent'];

                for (const key of requiredKeys) {
                    if (!(key in value)) {
                        throw new Error(`Missing required key: ${key}`);
                    }

                    if (typeof value[key] !== 'string') {
                        throw new Error(`The value of ${key} must be a string`);
                    }
                }
            }
        },
    },
    feedBackAndSupport: {
        type: DataTypes.JSON,
        defaultValue: {
            prefferedSupport: '',
            refferalProbability: '',
            inquiriesAboutDashboard: '',
        },
        validate: {
            isValidStructure(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('feedBackAndSupport must be a non-null object');
                }

                const requiredKeys = ['prefferedSupport', 'refferalProbability', 'inquiriesAboutDashboard'];

                for (const key of requiredKeys) {
                    if (!(key in value)) {
                        throw new Error(`Missing required key: ${key}`);
                    }

                    if (typeof value[key] !== 'string') {
                        throw new Error(`The value of ${key} must be a string`);
                    }
                }
            }
        },
    },
    personalizationAndCustomization: {
        type: DataTypes.JSON,
        defaultValue: {
            interestedInPersonalizedTraining: '',
            howToRecieveUpdates: '',
            contactInformation: '',
        },
        validate: {
            isValidStructure(value) {
                if (typeof value !== 'object' || value === null) {
                    throw new Error('personalizationAndCustomization must be a non-null object');
                }

                const requiredKeys = ['interestedInPersonalizedTraining', 'howToRecieveUpdates', 'contactInformation'];

                for (const key of requiredKeys) {
                    if (!(key in value)) {
                        throw new Error(`Missing required key: ${key}`);
                    }

                    if (typeof value[key] !== 'string') {
                        throw new Error(`The value of ${key} must be a string`);
                    }
                }
            }
        },
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database and tables are synced');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

module.exports = { Onboarding };