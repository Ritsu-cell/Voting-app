const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Voting App is running!');
});
  
const {jwtAuthMidlleware , generateToken} = require('./../jwt');

const userRoutes = require('./routes/userRoutes');
const candidaRoutes = require('./routes/candidateRoutes');

app.use('/users', userRoutes);
app.use('/candidates', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
