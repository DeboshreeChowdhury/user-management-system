document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5050/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error fetching data: " + error.message, "red"));
});

// Add user
const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function() {
    const username = document.querySelector('#name-input').value;
    const password = document.querySelector('#password-input').value;
    const firstname = document.querySelector('#firstname-input').value;
    const lastname = document.querySelector('#lastname-input').value;
    const salary = document.querySelector('#salary-input').value;
    const age = document.querySelector('#age-input').value;

    // Input validation
    if (!username || !password || !firstname || !lastname || !salary || !age) {
        displayMessage("Please fill in all fields!", "red");
        return;
    }
    
    // Validate salary and age as numbers
    if (isNaN(salary) || isNaN(age)) {
        displayMessage("Salary and Age must be numbers!", "red");
        return;
    }

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
            salary: parseFloat(salary),
            age: parseInt(age)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayMessage("User registered successfully!", "green");
            insertRowIntoTable(data['data']);
            clearRegistrationInputs(); // Clear the input fields after successful registration
        } else {
            displayMessage("Error: " + data.message, "red");
        }
    })
    .catch(error => displayMessage("Error adding user: " + error.message, "red"));
};

// Function to display messages with color support
function displayMessage(message, color = 'green') {
    const messageBox = document.querySelector('#message-box');
    messageBox.style.color = color;
    messageBox.textContent = message;
    setTimeout(() => {
        messageBox.textContent = ""; // Clear message after 3 seconds
    }, 3000);
}

// Clear input fields after successful registration
function clearRegistrationInputs() {
    document.querySelector('#name-input').value = "";
    document.querySelector('#password-input').value = "";
    document.querySelector('#firstname-input').value = "";
    document.querySelector('#lastname-input').value = "";
    document.querySelector('#salary-input').value = "";
    document.querySelector('#age-input').value = "";
}

// Search by name
const searchBtn = document.querySelector('#search-name-btn');
searchBtn.onclick = function() {
    const searchInput = document.querySelector('#search-name-input');
    const searchValue = searchInput.value.trim();
    searchInput.value = "";

    if (searchValue === "") {
        displayMessage("Please enter a name to search.", "red");
        return;
    }

    fetch('http://localhost:5050/searchByName/' + searchValue)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching by name: " + error.message, "red"));
};

// Search by user ID (username)
const searchUserIdBtn = document.querySelector('#search-username-btn');
searchUserIdBtn.onclick = function() {
    const userIdInput = document.querySelector('#search-username-input');
    const userId = userIdInput.value.trim();
    userIdInput.value = "";

    if (userId === "") {
        displayMessage("Please enter a user ID to search.", "red");
        return;
    }

    fetch('http://localhost:5050/searchByUsername/' + userId)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching by user ID: " + error.message, "red"));
};

// Search by salary
const searchSalaryBtn = document.querySelector('#search-salary-btn');
searchSalaryBtn.onclick = function() {
    const minSalary = document.querySelector('#salary-min-input').value;
    const maxSalary = document.querySelector('#salary-max-input').value;

    if (minSalary === "" || maxSalary === "") {
        displayMessage("Please enter both minimum and maximum salary.", "red");
        return;
    }

    fetch(`http://localhost:5050/searchBySalary?min=${minSalary}&max=${maxSalary}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching by salary: " + error.message, "red"));
};

// Search by age
const searchAgeBtn = document.querySelector('#search-age-btn');
searchAgeBtn.onclick = function() {
    const minAge = document.querySelector('#age-min-input').value;
    const maxAge = document.querySelector('#age-max-input').value;

    if (minAge === "" || maxAge === "") {
        displayMessage("Please enter both minimum and maximum age.", "red");
        return;
    }

    fetch(`http://localhost:5050/searchByAge?min=${minAge}&max=${maxAge}`)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching by age: " + error.message, "red"));
};

// Search users registered after a specific user
const searchAfterBtn = document.querySelector('#search-after-btn');
searchAfterBtn.onclick = function() {
    const afterUserId = document.querySelector('#after-userid-input').value.trim();
    document.querySelector('#after-userid-input').value = "";

    if (afterUserId === "") {
        displayMessage("Please enter a user ID to search after.", "red");
        return;
    }

    fetch('http://localhost:5050/searchAfter/' + afterUserId)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching users after: " + error.message, "red"));
};

// Search users who never signed in
const searchNeverSignedInBtn = document.querySelector('#search-never-signed-in-btn');
searchNeverSignedInBtn.onclick = function() {
    fetch('http://localhost:5050/searchNeverSignedIn')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error fetching users who never signed in: " + error.message, "red"));
};

// Search users registered on the same day
const searchSameDayBtn = document.querySelector('#search-same-day-btn');
searchSameDayBtn.onclick = function() {
    const sameDayUserId = document.querySelector('#same-day-userid-input').value.trim();
    document.querySelector('#same-day-userid-input').value = "";

    if (sameDayUserId === "") {
        displayMessage("Please enter a user ID to search.", "red");
        return;
    }

    fetch('http://localhost:5050/searchSameDay/' + sameDayUserId)
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error searching users registered on the same day: " + error.message, "red"));
};

// Search users registered today
const searchTodayBtn = document.querySelector('#search-today-btn');
searchTodayBtn.onclick = function() {
    fetch('http://localhost:5050/searchToday')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']))
        .catch(error => displayMessage("Error fetching users registered today: " + error.message, "red"));
};

// Delete and Edit functionality
let rowToDelete;

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        rowToDelete = event.target.closest('tr');
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        showEditRowInterface(event.target.dataset.id);
    }
});

function deleteRowById(id) {
    fetch('http://localhost:5050/delete/' + id, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                rowToDelete.remove();
            } else {
                displayMessage("Error deleting user: " + data.message, "red");
            }
        })
        .catch(error => displayMessage("Error deleting user: " + error.message, "red"));
}

let idToUpdate = 0;

function showEditRowInterface(id) {
    document.querySelector('#update-name-input').value = id; // populate with user ID
    idToUpdate = id;
}

const updateBtn = document.querySelector('#update-name-btn');
updateBtn.onclick = function() {
    const newName = document.querySelector('#update-name-input').value;
    const newPassword = document.querySelector('#update-password-input').value;
    
    if (newName === "" || newPassword === "") {
        displayMessage("Please fill in all fields!", "red");
        return;
    }

    fetch('http://localhost:5050/update/' + idToUpdate, {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'PUT',
        body: JSON.stringify({
            username: newName,
            password: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayMessage("User updated successfully!", "green");
            updateRowInTable(idToUpdate, newName, newPassword); // Update the row in the table instead of reloading
        } else {
            displayMessage("Error: " + data.message, "red");
        }
    })
    .catch(error => displayMessage("Error updating user: " + error.message, "red"));
};

// Function to update row in the table
function updateRowInTable(id, newName, newPassword) {
    const row = document.querySelector(`tr[data-id='${id}']`);
    if (row) {
        row.cells[0].textContent = newName; // Update username cell
        // Update password cell if needed
        row.cells[1].textContent = newPassword; // Just as an example, change it to your logic
    }
}

// Load HTML table
function loadHTMLTable(data) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="5">No data found</td>`;
        tableBody.appendChild(row);
    } else {
        data.forEach((rowData) => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', rowData.username);
            row.innerHTML = `
                <td>${rowData.username}</td>
                <td>${rowData.firstname}</td>
                <td>${rowData.lastname}</td>
                <td>${rowData.salary}</td>
                <td>${rowData.age}</td>
                <td>
                    <button class="edit-row-btn" data-id="${rowData.username}">Edit</button>
                    <button class="delete-row-btn" data-id="${rowData.username}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}
