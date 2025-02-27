require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const RAILS_API_URL = process.env.RAILS_API_URL || 'http://localhost:3000';

// User Signup Route
app.post('/signup', async (req, res) => {
    try {
        const response = await axios.post(`${RAILS_API_URL}/api/app/account`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    try {
        const response = await axios.post(`${RAILS_API_URL}/auth/login`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

// Proxy to Rails API
app.get('/account', async (req, res) => {
    try {
        const response = await axios.get(`${RAILS_API_URL}/api/app/account`, {
            headers: { Authorization: req.headers.authorization },
        });
        console.log('Account data retrieved successfully:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error(error);

        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
