const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    guests: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
    },
    priority: {
        type: DataTypes.ENUM('high', 'low', 'medium'),
        defaultValue: 'low',
        allowNull: false,
    },
    repeat: {
        type: DataTypes.ENUM('no-repeat', 'repeat'),
        defaultValue: 'no-repeat',
    },
    star: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

sequelize.sync()
    .then(() => {
        console.log('Database & tables created!');
    });

module.exports = { Task };
