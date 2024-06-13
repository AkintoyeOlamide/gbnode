const { Task } = require('../models/Task');

const createTask = async (req, res) => {
    try {
        const {
            title,
            guests,
            startDate,
            endDate,
            description,
            priority,
            repeat,
            star,
        } = req.body;

        const requiredFields = { title, guests, startDate, endDate, description, priority };
        for (const [key, value] of Object.entries(requiredFields)) {
            if (value === undefined) {
                return res.status(400).json({ error: `${key} is required` });
            }
        }

        const validPriorities = ['high', 'medium', 'low'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ error: 'priority must be one of "high", "medium", or "low"' });
        }

        if (isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'startDate must be a valid date' });
        }
        if (isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'endDate must be a valid date' });
        }

        const task = await Task.create({
            title,
            guests,
            startDate,
            endDate,
            description,
            priority,
            repeat,
            star,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createTask,
};
