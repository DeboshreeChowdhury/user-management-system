const mysql = require('mysql');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // for password hashing
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.PASSWORD || "",
    database: process.env.DATABASE || "web_app",
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the database, state: ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        if (!instance) {
            instance = new DbService();
        }
        return instance;
    }

    // User registration
    async registerUser(username, password, firstname, lastname, salary, age) {
        try {
            const registerDay = new Date(); // current date
            const query = "INSERT INTO users (username, password, firstname, lastname, salary, age, registerday) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const result = await this.queryPromise(query, [username, password, firstname, lastname, salary, age, registerDay]);
            return result;
        } catch (error) {
            console.error("Error during user registration:", error);
            throw new Error("User registration failed.");
        }
    }

    // User sign-in
    async signInUser(username, password) {
        try {
            const query = "SELECT password FROM users WHERE username = ?";
            const results = await this.queryPromise(query, [username]);

            if (results.length > 0) {
                const isMatch = await bcrypt.compare(password, results[0].password); // compare hashed passwords
                if (isMatch) {
                    const signInTime = new Date(); // current datetime
                    const updateQuery = "UPDATE users SET signintime = ? WHERE username = ?";
                    await this.queryPromise(updateQuery, [signInTime, username]);
                    return true; // success
                } else {
                    throw new Error("Incorrect password.");
                }
            } else {
                throw new Error("User not found.");
            }
        } catch (error) {
            console.error("Error during user sign-in:", error);
            throw error; // rethrow error for handling in the calling function
        }
    }

    // Search users by first or last name
    async searchByName(firstname, lastname) {
        try {
            const query = "SELECT * FROM users WHERE firstname = ? OR lastname = ?";
            const results = await this.queryPromise(query, [firstname, lastname]);
            return results;
        } catch (error) {
            console.error("Error during search by name:", error);
            throw new Error("Search by name failed.");
        }
    }

    // Search users by username
    async searchById(username) {
        try {
            const query = "SELECT * FROM users WHERE username = ?";
            const results = await this.queryPromise(query, [username]);
            return results;
        } catch (error) {
            console.error("Error during search by ID:", error);
            throw new Error("Search by ID failed.");
        }
    }

    // Search users by salary range
    async searchBySalaryRange(minSalary, maxSalary) {
        try {
            const query = "SELECT * FROM users WHERE salary BETWEEN ? AND ?";
            const results = await this.queryPromise(query, [minSalary, maxSalary]);
            return results;
        } catch (error) {
            console.error("Error during search by salary range:", error);
            throw new Error("Search by salary range failed.");
        }
    }

    // Search users by age range
    async searchByAgeRange(minAge, maxAge) {
        try {
            const query = "SELECT * FROM users WHERE age BETWEEN ? AND ?";
            const results = await this.queryPromise(query, [minAge, maxAge]);
            return results;
        } catch (error) {
            console.error("Error during search by age range:", error);
            throw new Error("Search by age range failed.");
        }
    }

    // Search users who registered after a specific user
    async searchUsersAfter(username) {
        try {
            const query = `SELECT * FROM users WHERE registerday > (SELECT registerday FROM users WHERE username = ?)`;
            const results = await this.queryPromise(query, [username]);
            return results;
        } catch (error) {
            console.error("Error during search for users registered after:", error);
            throw new Error("Search for users registered after failed.");
        }
    }

    // Search users who never signed in
    async searchUsersNeverSignedIn() {
        try {
            const query = "SELECT * FROM users WHERE signintime IS NULL";
            const results = await this.queryPromise(query);
            return results;
        } catch (error) {
            console.error("Error during search for users who never signed in:", error);
            throw new Error("Search for users who never signed in failed.");
        }
    }

    // Search users who registered on the same day as another user
    async searchUsersSameDay(username) {
        try {
            const query = `SELECT * FROM users WHERE registerday = (SELECT registerday FROM users WHERE username = ?)`;
            const results = await this.queryPromise(query, [username]);
            return results;
        } catch (error) {
            console.error("Error during search for users registered on the same day:", error);
            throw new Error("Search by registration date failed.");
        }
    }

    // Get users registered today
    async getUsersRegisteredToday() {
        try {
            const query = "SELECT * FROM users WHERE registerday = CURDATE()";
            const results = await this.queryPromise(query);
            return results;
        } catch (error) {
            console.error("Error during search for users registered today:", error);
            throw new Error("Search for users registered today failed.");
        }
    }

    // Helper function to wrap MySQL query in a Promise
    queryPromise(query, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = DbService;
