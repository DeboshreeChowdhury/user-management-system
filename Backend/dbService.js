const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // for password hashing
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_app",
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    // User registration
    async registerUser(username, password, firstname, lastname, salary, age) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // hashing the password
            const registerDay = new Date(); // current date
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO users (username, password, firstname, lastname, salary, age, registerday) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(query, [username, hashedPassword, firstname, lastname, salary, age, registerDay], (err, result) => {
                    if (err) reject(new Error(err.message));
                    else resolve(result);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // User sign-in
    async signInUser(username, password) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT password FROM users WHERE username = ?";
                connection.query(query, [username], async (err, results) => {
                    if (err) reject(new Error(err.message));
                    if (results.length > 0) {
                        const isMatch = await bcrypt.compare(password, results[0].password); // comparing hashed passwords
                        if (isMatch) {
                            const signInTime = new Date(); // current datetime
                            const updateQuery = "UPDATE users SET signintime = ? WHERE username = ?";
                            connection.query(updateQuery, [signInTime, username]);
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    } else {
                        resolve(false); // no user found
                    }
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users by first or last name
    async searchByName(firstname, lastname) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE firstname = ? OR lastname = ?";
                connection.query(query, [firstname, lastname], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users by username
    async searchById(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE username = ?";
                connection.query(query, [username], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users by salary range
    async searchBySalaryRange(minSalary, maxSalary) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE salary BETWEEN ? AND ?";
                connection.query(query, [minSalary, maxSalary], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users by age range
    async searchByAgeRange(minAge, maxAge) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE age BETWEEN ? AND ?";
                connection.query(query, [minAge, maxAge], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users who registered after a specific user
    async searchUsersAfter(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM users WHERE registerday > (SELECT registerday FROM users WHERE username = ?)`;
                connection.query(query, [username], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users who never signed in
    async searchUsersNeverSignedIn() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE signintime IS NULL";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users who registered on the same day as another user
    async searchUsersSameDay(username) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT * FROM users WHERE registerday = (SELECT registerday FROM users WHERE username = ?)`;
                connection.query(query, [username], (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    // Search users registered today
    async getUsersRegisteredToday() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM users WHERE registerday = CURDATE()";
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    else resolve(results);
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;
