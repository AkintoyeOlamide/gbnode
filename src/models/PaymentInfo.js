const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PaymentInfo = sequelize.define('PaymentInfo', {
    authorization_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    emailAssociated: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    cardInfo: {
        type: DataTypes.JSON,
        allowNull: true
    },
    customerInfo: {
        type: DataTypes.JSON,
        allowNull: true
    },
    transactions: {
        type: DataTypes.ARRAY(DataTypes.JSON({
            reference: {
                type: DataTypes.STRING,
                allowNull: false
            },
            amount: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            timeOfTransaction: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        })),
        allowNull: false,
        defaultValue: []
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database and tables are synced');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

module.exports = { PaymentInfo };
