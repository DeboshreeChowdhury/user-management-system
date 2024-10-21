// Backend: application services, accessible by URIs

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

//1. User registration
app.post('/register', (request, response) => {
    const { username, password, firstname, lastname, salary, age } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.registerUser(username, password, firstname, lastname, salary, age);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'User registration failed' });
        });
});

//2. User sign-in
app.post('/signin', (request, response) => {
    const { username, password } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.signInUser(username, password);

    result
        .then(data => {
            if (data) {
                response.json({ success: true, message: 'User signed in successfully', data });
            } else {
                response.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        })
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'User sign-in failed' });
        });
});

// 3. Search users by first or last name
app.get('/searchByName', (request, response) => {
    const { firstname, lastname } = request.query;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByName(firstname, lastname);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search failed' });
        });
});

//4. Search users by user ID (username)
app.get('/searchById/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchById(username);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search by ID failed' });
        });
});

// 5. Search users by salary range
app.get('/searchBySalary', (request, response) => {
    const { minSalary, maxSalary } = request.query;
    const db = dbService.getDbServiceInstance();

    const result = db.searchBySalaryRange(minSalary, maxSalary);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search by salary range failed' });
        });
});

//6. Search users by age range
app.get('/searchByAge', (request, response) => {
    const { minAge, maxAge } = request.query;
    const db = dbService.getDbServiceInstance();

    const result = db.searchByAgeRange(minAge, maxAge);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search by age range failed' });
        });
});

//7. Search users who registered after a specific user
app.get('/searchAfterUser/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchUsersAfter(username);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search after user failed' });
        });
});

//8. Search users who never signed in
app.get('/searchNeverSignedIn', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.searchUsersNeverSignedIn();

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search for users who never signed in failed' });
        });
});

//9. Search users who registered on the same day as another user
app.get('/searchSameDay/:username', (request, response) => {
    const { username } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.searchUsersSameDay(username);

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search by registration date failed' });
        });
});

//10. Return users registered today
app.get('/registeredToday', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getUsersRegisteredToday();

    result
        .then(data => response.json({ success: true, data }))
        .catch(err => {
            console.log(err);
            response.status(500).json({ success: false, message: 'Search for users registered today failed' });
        });
});

// Web server listener
app.listen(5050, () => {
    console.log("I am listening on the fixed port 5050.");
});
