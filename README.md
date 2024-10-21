# user-management-system
User management system with registration and sign-in functionality
Project Overview
This User Management System is a web application designed to manage users by offering functionalities like user registration, sign-in, and searching users based on various criteria (such as name, age, salary, etc.). The system provides both front-end and back-end integration and stores data in a MySQL database. It also supports password hashing for secure authentication.

#Features
User Registration: Users can register with a username, password, first name, last name, salary, and age.
User Sign-In: Registered users can sign in using their username and password.
Search Users: You can search for users based on:
Name
User ID
Salary range
Age range
Registration date (same day or after a specific user)
Users who never signed in
Users registered today
Edit/Delete User: You can edit user details or delete users.
Technologies Used
Frontend:

HTML/CSS
JavaScript
Backend:

Node.js
Express.js
Database:

MySQL
Tools:

XAMPP (for local MySQL server)
bcrypt (for password hashing)
Nodemon (for backend development)
Project Structure
The project is organized into two main parts:

Backend: Contains all the server-side code for the API and database interactions.

app.js: The main file that initializes the server.
dbService.js: Handles database queries.
.env: Contains environment variables for database configuration.
Frontend: Contains the user interface for interacting with the system.

#index.html: The main HTML file.
#index.js: Contains JavaScript code to interact with the backend.


