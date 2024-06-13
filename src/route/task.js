const { Router } = require('express');
const route = Router();
const { createTask } = require('../controllers/task')

route.post('/create', createTask);

module.exports = route;