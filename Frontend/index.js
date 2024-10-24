const registerForm = document.getElementById('registerForm');
const signinForm = document.getElementById('signinForm');
const searchForm = document.getElementById('searchForm');
const searchByIdForm = document.getElementById('searchByIdForm');
const salaryRangeForm = document.getElementById('salaryRangeForm');
const ageRangeForm = document.getElementById('ageRangeForm');
const searchAfterUserForm = document.getElementById('searchAfterUserForm');
const searchNeverSignedInForm = document.getElementById('searchNeverSignedInForm');
const searchSameDayForm = document.getElementById('searchSameDayForm');
const searchTodayForm = document.getElementById('searchTodayForm');
const resultsDiv = document.getElementById('results');

// Register User
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        username: document.getElementById('registerUsername').value,
        password: document.getElementById('registerPassword').value,
        firstname: document.getElementById('registerFirstname').value,
        lastname: document.getElementById('registerLastname').value,
        salary: document.getElementById('registerSalary').value,
        age: document.getElementById('registerAge').value,
        registerday: document.getElementById('registerDay').value
    };

    fetch('http://localhost:5050/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Sign In User
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        username: document.getElementById('signinUsername').value,
        password: document.getElementById('signinPassword').value
    };

    fetch('http://localhost:5050/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search Users by First/Last Name
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstname = document.getElementById('searchFirstname').value;
    const lastname = document.getElementById('searchLastname').value;

    fetch(`http://localhost:5050/search/name?firstname=${firstname}&lastname=${lastname}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search User by ID
searchByIdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('searchById').value;

    fetch(`http://localhost:5050/search/userid/${id}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search Users by Salary Range
salaryRangeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const minSalary = document.getElementById('minSalary').value;
    const maxSalary = document.getElementById('maxSalary').value;

    fetch(`http://localhost:5050/search/salary?minSalary=${minSalary}&maxSalary=${maxSalary}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search Users by Age Range
ageRangeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const minAge = document.getElementById('minAge').value;
    const maxAge = document.getElementById('maxAge').value;

    fetch(`http://localhost:5050/search/age?minAge=${minAge}&maxAge=${maxAge}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search users who registered after a specific user
searchAfterUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('afterUserId').value;

    fetch(`http://localhost:5050/search/registeredafter/${id}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search users who never signed in
searchNeverSignedInForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('http://localhost:5050/search/neversignedin')
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Search users who registered on the same day as a specific user
searchSameDayForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('sameDayUserId').value;

    fetch(`http://localhost:5050/search/sameday/${id}`)
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Return users who registered today
searchTodayForm.addEventListener('submit', (e) => {
    e.preventDefault();

    fetch('http://localhost:5050/search/registeredtoday')
    .then(response => response.json())
    .then(data => showResults(data))
    .catch(err => console.error('Error:', err));
});

// Display results
function showResults(data) {
    resultsDiv.innerHTML = JSON.stringify(data, null, 2);
}
