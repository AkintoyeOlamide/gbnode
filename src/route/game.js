const { Router } = require('express');
const route = Router();

route.get('/', async (req, res) => {
    try {
        return res.status(200).json('');
    } catch (error) {
        console.log(error);
    }
});

module.exports = route;