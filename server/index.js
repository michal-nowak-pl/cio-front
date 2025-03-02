require('dotenv').config({ path: './server/.env.local' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key', // Replace with your actual secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const RAILS_API_URL = process.env.RAILS_API_URL || 'http://localhost:3000';

// User Signup Route
app.post('/signup', async (req, res) => {
    try {
        const response = await axios.post(`${RAILS_API_URL}/api/app/account`, req.body);
        const token = response.headers['x-api-token'];

        if (token) {
            req.session.apiToken = token;
        }
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    try {
        console.log(req.body.token);
        const response = await axios.post(`${RAILS_API_URL}/api/app/login/magic-auth`, {
            token: req.body.token
        });
        const apiToken = response.headers['x-api-token'];

        if (apiToken) {
            req.session.apiToken = apiToken;
        }
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

// User Logout Route
app.delete('/logout', async (req, res) => {
    try {
        const token = req.session.apiToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const response = await axios.delete(`${RAILS_API_URL}/api/app/auth`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        req.session.apiToken = null;
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

// Proxy to Rails API
app.get('/account', async (req, res) => {
    try {
        const token = req.session.apiToken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const response = await axios.get(`${RAILS_API_URL}/api/app/account`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { message: "Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
