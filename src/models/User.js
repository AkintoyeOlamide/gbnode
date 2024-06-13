const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    slug: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
    },
    salt: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    country: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    otp: {
        type: DataTypes.STRING,
    },
    otpVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

// const dropUsersTable = async () => {
//     try {
//         // Drop the 'Users' table if it exists
//         await User.drop();
//         console.log('Users table dropped successfully.');
//     } catch (error) {
//         console.error('Error dropping Users table:', error);
//     } finally {
//         // Close the Sequelize connection
//         await sequelize.close();
//         console.log('Connection closed.');
//     }
// };

// dropUsersTable();

sequelize.sync()
    .then(() => {
        console.log('Database and tables are synced');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

module.exports = { User };
