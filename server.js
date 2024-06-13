const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.sendStatus(200));
app.use('/user', require('./src/route/auth'));
app.use('/payment', require('./src/route/payment'));
app.use('/game', require('./src/route/game'));

app.listen(process.env.PORT, () => console.log(`listening at port ${process.env.PORT}`));