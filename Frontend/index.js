document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:5050/getAll')     
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

// Add user
const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5050/insert', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

// Search by name
const searchBtn = document.querySelector('#search-btn');
searchBtn.onclick = function() {
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search by user ID
const searchUserIdBtn = document.querySelector('#search-userid-btn');
searchUserIdBtn.onclick = function() {
    const userIdInput = document.querySelector('#search-userid-input');
    const userId = userIdInput.value;
    userIdInput.value = "";

    fetch('http://localhost:5050/searchById/' + userId)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search by salary
const searchSalaryBtn = document.querySelector('#search-salary-btn');
searchSalaryBtn.onclick = function() {
    const minSalary = document.querySelector('#salary-min-input').value;
    const maxSalary = document.querySelector('#salary-max-input').value;

    fetch(`http://localhost:5050/searchBySalary?min=${minSalary}&max=${maxSalary}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search by age
const searchAgeBtn = document.querySelector('#search-age-btn');
searchAgeBtn.onclick = function() {
    const minAge = document.querySelector('#age-min-input').value;
    const maxAge = document.querySelector('#age-max-input').value;

    fetch(`http://localhost:5050/searchByAge?min=${minAge}&max=${maxAge}`)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search users registered after a specific user
const searchAfterBtn = document.querySelector('#search-after-btn');
searchAfterBtn.onclick = function() {
    const afterUserId = document.querySelector('#after-userid-input').value;
    document.querySelector('#after-userid-input').value = "";

    fetch('http://localhost:5050/searchAfter/' + afterUserId)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search users who never signed in
const searchNeverSignedInBtn = document.querySelector('#search-never-signed-in-btn');
searchNeverSignedInBtn.onclick = function() {
    fetch('http://localhost:5050/searchNeverSignedIn')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search users registered on the same day
const searchSameDayBtn = document.querySelector('#search-same-day-btn');
searchSameDayBtn.onclick = function() {
    const sameDayUserId = document.querySelector('#same-day-userid-input').value;
    document.querySelector('#same-day-userid-input').value = "";

    fetch('http://localhost:5050/searchSameDay/' + sameDayUserId)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

// Search users registered today
const searchTodayBtn = document.querySelector('#search-today-btn');
searchTodayBtn.onclick = function() {
    fetch('http://localhost:5050/searchToday')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}

let rowToDelete;

document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.dataset.id);   
        rowToDelete = event.target.parentNode.parentNode.rowIndex;    
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
            document.getElementById("table").deleteRow(rowToDelete);
        }
    });
}

let idToUpdate = 0;

function showEditRowInterface(id) {
    document.querySelector('#update-name-input').value = "";
    const updateSection = document.querySelector("#update-row");  
    updateSection.hidden = false;
    idToUpdate = id;
}

const updateBtn = document.querySelector('#update-row-btn');

updateBtn.onclick = function() {
    const updatedNameInput = document.querySelector('#update-name-input');

    fetch('http://localhost:5050/update', {
        headers: { 'Content-type': 'application/json' },
        method: 'PATCH',
        body: JSON.stringify({ id: idToUpdate, name: updatedNameInput.value })
    }) 
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    });
}

function insertRowIntoTable(data) {
    const table = document.querySelector('table tbody');
    let tableHtml = "<tr>";
    
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'dateAdded') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
    tableHtml += "</tr>";

    const isTableData = table.querySelector('.no-data');
    
    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newrow = table.insertRow();
        newrow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector('table tbody'); 
    
    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";
    data.forEach(function ({ id, name, date_added }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
