const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // For password hashing
dotenv.config();

const app = express();
const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// User registration
app.post('/register', async (request, response) => {
    const { username, password, firstname, lastname, salary, age } = request.body;
    const db = dbService.getDbServiceInstance();

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const result = await db.registerUser(username, hashedPassword, firstname, lastname, salary, age);
        
        if (result) {
            response.json({ success: true, message: 'User registered successfully!', data: result });
        } else {
            response.status(400).json({ success: false, message: 'User registration failed. Please try again.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Internal server error during registration' });
    }
});

// User sign-in
app.post('/signin', async (request, response) => {
    const { username, password } = request.body;
    const db = dbService.getDbServiceInstance();

    try {
        const user = await db.getUserByUsername(username); // Fetch user info by username
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password); // Validate password
            if (validPassword) {
                const signInResult = await db.signInUser(username); // Update sign-in time
                response.json({ success: true, message: 'User signed in successfully!', data: signInResult });
            } else {
                response.status(401).json({ success: false, message: 'Incorrect password!' });
            }
        } else {
            response.status(404).json({ success: false, message: 'User not found!' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Error during sign-in' });
    }
});

// Search users by first or last name
app.get('/searchByName', async (request, response) => {
    const { firstname, lastname } = request.query;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchByName(firstname, lastname);
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found with the provided name(s).' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search by name failed' });
    }
});

// Search users by username (ID)
app.get('/searchById/:username', async (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchById(username);
        if (data) {
            response.json({ success: true, data });
        } else {
            response.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search by ID failed' });
    }
});

// Search users by salary range
app.get('/searchBySalary', async (request, response) => {
    const { minSalary, maxSalary } = request.query;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchBySalaryRange(minSalary, maxSalary);
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found in the specified salary range.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search by salary range failed' });
    }
});

// Search users by age range
app.get('/searchByAge', async (request, response) => {
    const { minAge, maxAge } = request.query;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchByAgeRange(minAge, maxAge);
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found in the specified age range.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search by age range failed' });
    }
});

// Search users who registered after a specific user
app.get('/searchAfterUser/:username', async (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchUsersAfter(username);
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found who registered after the specified user.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search after user failed' });
    }
});

// Search users who never signed in
app.get('/searchNeverSignedIn', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchUsersNeverSignedIn();
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found who never signed in.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search for users who never signed in failed' });
    }
});

// Search users who registered on the same day as another user
app.get('/searchSameDay/:username', async (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.searchUsersSameDay(username);
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users found who registered on the same day.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search by registration date failed' });
    }
});

// Return users registered today
app.get('/registeredToday', async (request, response) => {
    const db = dbService.getDbServiceInstance();

    try {
        const data = await db.getUsersRegisteredToday();
        if (data.length > 0) {
            response.json({ success: true, data });
        } else {
            response.json({ success: false, message: 'No users registered today.' });
        }
    } catch (err) {
        console.error(err);
        response.status(500).json({ success: false, message: 'Search for users registered today failed' });
    }
});

// Web server listener
app.listen(5050, () => {
    console.log("Listening on port 5050.");
});
