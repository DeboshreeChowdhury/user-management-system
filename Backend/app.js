const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const DbService = require('./dbService');

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json()); // To handle JSON payloads
app.use(express.urlencoded({ extended: false })); // To handle form data

// Initialize the database service
const db = DbService.getDbServiceInstance();

// Home route to ensure the app is running
app.get('/', (req, res) => {
    res.send('User Management System Backend is running.');
});

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, password, firstname, lastname, salary, age } = req.body;

    try {
        const result = await db.registerUser(username, password, firstname, lastname, salary, age);
        res.status(201).json({ success: true, data: result, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// User Sign-in Route
app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.signInUser(username, password);
        if (result) {
            res.status(200).json({ success: true, message: "Sign-in successful" });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
});

// Search Users by First or Last Name
app.get('/search/name', async (req, res) => {
    const { firstname, lastname } = req.query;

    try {
        const results = await db.searchByName(firstname, lastname);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users by Username (User ID)
app.get('/search/id', async (req, res) => {
    const { username } = req.query;

    try {
        const results = await db.searchById(username);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users by Salary Range
app.get('/search/salary', async (req, res) => {
    const { minSalary, maxSalary } = req.query;

    try {
        const results = await db.searchBySalaryRange(minSalary, maxSalary);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users by Age Range
app.get('/search/age', async (req, res) => {
    const { minAge, maxAge } = req.query;

    try {
        const results = await db.searchByAgeRange(minAge, maxAge);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users who registered after a specific user (by ID)
app.get('/search/after', async (req, res) => {
    const { username } = req.query;

    try {
        const results = await db.searchUsersAfter(username);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users who never signed in
app.get('/search/never-signed-in', async (req, res) => {
    try {
        const results = await db.searchUsersNeverSignedIn();
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Search Users who registered on the same day as another user
app.get('/search/same-day', async (req, res) => {
    const { username } = req.query;

    try {
        const results = await db.searchUsersSameDay(username);
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Users registered today
app.get('/search/registered-today', async (req, res) => {
    try {
        const results = await db.getUsersRegisteredToday();
        res.status(200).json({ success: true, data: results });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start the server
app.listen(5050, () => {
    console.log(`Server is running on port ${5050}`);
});
