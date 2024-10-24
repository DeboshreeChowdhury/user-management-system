const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dbService = require('./dbService');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 1. Register a new user
app.post('/register', (req, res) => {
    const { username, password, firstname, lastname, salary, age, registerday } = req.body;
    const db = dbService.getDbServiceInstance();
    
    db.registerUser(username, password, firstname, lastname, salary, age, registerday)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 2. User sign-in
app.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const db = dbService.getDbServiceInstance();

    db.signInUser(username, password)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 3. Search users by first or last name
app.get('/search/name', (req, res) => {
    const { firstname, lastname } = req.query;
    const db = dbService.getDbServiceInstance();

    db.searchByName(firstname, lastname)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 4. Search users by user ID
app.get('/search/userid/:id', (req, res) => {
    const { id } = req.params;
    const db = dbService.getDbServiceInstance();

    db.searchByUserId(id)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 5. Search users by salary range
app.get('/search/salary', (req, res) => {
    const { minSalary, maxSalary } = req.query;
    const db = dbService.getDbServiceInstance();

    db.searchBySalaryRange(minSalary, maxSalary)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 6. Search users by age range
app.get('/search/age', (req, res) => {
    const { minAge, maxAge } = req.query;
    const db = dbService.getDbServiceInstance();

    db.searchByAgeRange(minAge, maxAge)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 7. Search users registered after a specific user
app.get('/search/registeredAfter/:userid', (req, res) => {
    const { userid } = req.params;
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredAfter(userid)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 8. Search users who never signed in
app.get('/search/noSignIn', (req, res) => {
    const db = dbService.getDbServiceInstance();

    db.searchNeverSignedIn()
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 9. Search users who registered on the same day as a specific user
app.get('/search/registeredSameDay/:userid', (req, res) => {
    const { userid } = req.params;
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredSameDay(userid)
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

// 10. Return users who registered today
app.get('/search/registeredToday', (req, res) => {
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredToday()
        .then(data => res.json({ success: true, data }))
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});

app.listen(5050, () => console.log('Server is running on port 5050'));
