const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://grambutler_db_user:sOzVyHnSlOqXSfvUgTPH786oCaqrzSIp@dpg-coj0nogl5elc73df676g-a.oregon-postgres.render.com/grambutler_db', {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = sequelize;