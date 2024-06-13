const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gamer = sequelize.define('Gamer', {
    userInformation: {
        type: DataTypes.JSON,
    },
    topScore: {
        type: DataTypes.BIGINT
    }
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

module.exports = { Gamer };
