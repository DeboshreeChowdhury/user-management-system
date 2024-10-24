const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

class DbService {
    static getDbServiceInstance() {
        return new DbService();
    }

    async registerUser(username, password, firstname, lastname, salary, age, registerday) {
        try {
            const query = 'INSERT INTO Users (username, password, firstname, lastname, salary, age, registerday) VALUES (?, ?, ?, ?, ?, ?, ?);';
            const result = await this.execute(query, [username, password, firstname, lastname, salary, age, registerday]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async signInUser(username, password) {
        try {
            const query = 'SELECT * FROM Users WHERE username = ? AND password = ?;';
            const result = await this.execute(query, [username, password]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchByName(firstname, lastname) {
        try {
            const query = 'SELECT * FROM Users WHERE firstname LIKE ? OR lastname LIKE ?;';
            const result = await this.execute(query, [`%${firstname}%`, `%${lastname}%`]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchByUserId(id) {
        try {
            const query = 'SELECT * FROM Users WHERE username = ?;';
            const result = await this.execute(query, [id]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchBySalaryRange(minSalary, maxSalary) {
        try {
            const query = 'SELECT * FROM Users WHERE salary BETWEEN ? AND ?;';
            const result = await this.execute(query, [minSalary, maxSalary]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchByAgeRange(minAge, maxAge) {
        try {
            const query = 'SELECT * FROM Users WHERE age BETWEEN ? AND ?;';
            const result = await this.execute(query, [minAge, maxAge]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchRegisteredAfter(userid) {
        try {
            const query = 'SELECT * FROM Users WHERE registerday > (SELECT registerday FROM Users WHERE username = ?);';
            const result = await this.execute(query, [userid]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchNeverSignedIn() {
        try {
            const query = 'SELECT * FROM Users WHERE signintime IS NULL;';
            const result = await this.execute(query);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchRegisteredSameDay(userid) {
        try {
            const query = 'SELECT * FROM Users WHERE registerday = (SELECT registerday FROM Users WHERE username = ?);';
            const result = await this.execute(query, [userid]);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    async searchRegisteredToday() {
        try {
            const query = 'SELECT * FROM Users WHERE registerday = CURDATE();';
            const result = await this.execute(query);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    execute(query, params = []) {
        return new Promise((resolve, reject) => {
            connection.query(query, params, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = DbService;
