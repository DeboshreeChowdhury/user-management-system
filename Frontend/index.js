// Define the base URL for the backend API
const BASE_URL = 'http://localhost:5050';

// Handle user registration
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const firstname = document.getElementById('register-firstname').value;
    const lastname = document.getElementById('register-lastname').value;
    const salary = document.getElementById('register-salary').value;
    const age = document.getElementById('register-age').value;

    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, firstname, lastname, salary, age })
        });
        
        const data = await response.json();
        showMessage(data.message, data.success);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Something went wrong. Please try again.', false);
    }
});

// Handle user sign-in
document.getElementById('signin-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        showMessage(data.message, data.success);
    } catch (error) {
        console.error('Error:', error);
        showMessage('Something went wrong. Please try again.', false);
    }
});

// Handle user search by first and/or last name
document.getElementById('search-name-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstname = document.getElementById('search-firstname').value;
    const lastname = document.getElementById('search-lastname').value;

    try {
        const response = await fetch(`${BASE_URL}/search/name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstname, lastname })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle user search by user ID
document.getElementById('search-id-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('search-username-id').value;

    try {
        const response = await fetch(`${BASE_URL}/search/id`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle user search by salary range
document.getElementById('search-salary-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const salaryMin = document.getElementById('salary-min').value;
    const salaryMax = document.getElementById('salary-max').value;

    try {
        const response = await fetch(`${BASE_URL}/search/salary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ salaryMin, salaryMax })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle user search by age range
document.getElementById('search-age-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const ageMin = document.getElementById('age-min').value;
    const ageMax = document.getElementById('age-max').value;

    try {
        const response = await fetch(`${BASE_URL}/search/age`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ageMin, ageMax })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle user search who registered after a specific user
document.getElementById('search-after-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('search-after-username').value;

    try {
        const response = await fetch(`${BASE_URL}/search/after`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle users who never signed in
document.getElementById('search-never-signed-in').addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/search/never-signed-in`);
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle users registered on the same day as a specific user
document.getElementById('search-same-day-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('search-same-day-username').value;

    try {
        const response = await fetch(`${BASE_URL}/search/same-day`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Handle users who registered today
document.getElementById('search-today').addEventListener('click', async () => {
    try {
        const response = await fetch(`${BASE_URL}/search/today`);
        const data = await response.json();
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Display search results in the results table
function displaySearchResults(users) {
    const resultsTableBody = document.getElementById('search-results-body');
    resultsTableBody.innerHTML = ''; // Clear previous results

    if (users.length === 0) {
        resultsTableBody.innerHTML = '<tr><td colspan="6">No results found.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.salary}</td>
            <td>${user.age}</td>
            <td>${user.registerday}</td>
            <td>${user.signintime || 'Never signed in'}</td>
        `;
        resultsTableBody.appendChild(row);
    });
}

// Show messages to the user
function showMessage(message, success) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = success ? 'message success' : 'message error';
    messageElement.style.display = 'block';

    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000);
}
