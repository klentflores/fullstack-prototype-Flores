//Function to handle showing the right form based on the URL
function handleRoute() {
    const hash = window.location.hash || '#/';
    
    // Select all pages
    const homePage = document.getElementById('home-page');
    const loginPage = document.getElementById('login-page');
    const registerPage = document.getElementById('register-page');
    const profilePage = document.getElementById('profile-page');

    // Hide all pages first
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Routing Logic
    if (hash === '#/register') {
        document.getElementById('register-page').classList.add('active');
    } else if (hash === '#/verify-email') {
        document.getElementById('verify-email-page').classList.add('active');
    } else if (hash === '#/login') {
        document.getElementById('login-page').classList.add('active');
    } else if (hash === '#/profile') {
        document.getElementById('profile-page').classList.add('active');
    }
    else if (hash === '#/employees') {
        document.getElementById('employees-page').classList.add('active');

    } else {
        document.getElementById('home-page').classList.add('active');
    } 
}
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

//Handle Login Form Submission
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    //Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    //Find if user exists with matching password
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {

        alert("Login Successful! Welcome Admin " + user.firstName);
        // Change body class as required in PDF Phase 1
        document.body.classList.remove('not-authenticated');
        document.body.classList.add('authenticated');

        // Fill profile data
        document.getElementById('profileName').innerText = user.firstName + " " + user.lastName;
        document.getElementById('displayEmail').innerText = user.email;
        document.getElementById('displayRole').innerText = "Admin";

        // Redirect to Admin Profile
        window.location.hash = '#/profile';

    } else {

        alert("Invalid email or password!");
    }

});


//Cancel button Login Form
document.getElementById('cancelLogin').addEventListener('click', () => {

    //Clear inputs email and password
    const loginForm = document.getElementById('loginForm');
    loginForm.reset(); 

    alert("Login Cancelled.");

});


//Sign Up Button Register Form
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('regFirst').value;
    const lastName = document.getElementById('regLast').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;
    
    const newUser = { firstName, lastName, email, password };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('verifyEmailText').innerText = email;
    window.location.hash = '#/verify-email';

    });

    //Simulate Verification
document.getElementById('simulateVerifyBtn').addEventListener('click', () => {
    const loginAlert = document.getElementById('loginAlert');
    if (loginAlert) {
        loginAlert.classList.remove('d-none');
    }
    window.location.hash = '#/login';
});


//Cancel button Register Form
document.getElementById('cancelRegister').addEventListener('click', () => {
    //back to login form
    window.location.hash = '#/login';

    alert("Register Cancelled.");

});

//logout button in the admin
document.getElementById('logoutBtn').addEventListener('click', () => {
    document.body.classList.remove('authenticated');
    document.body.classList.add('not-authenticated');
    
    //Redirect back to the Home Page
    window.location.hash = '#/';
    alert("Logged out to Home Page.");
});

// --- EMPLOYEES PAGE LOGIC ---

const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.querySelector('#employees-page table tbody');

// 1. ADD EMPLOYEE BUTTON (Scrolls to or focuses the form)
document.getElementById('addEmployeeBtn').addEventListener('click', () => {
    document.getElementById('empId').focus();
    // Optional: if your form is hidden, you can toggle it here
    alert("Ready to add a new employee!");
});

// 2. SAVE BUTTON (Form Submission)
employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Grab values
    const id = document.getElementById('empId').value;
    const email = document.getElementById('empEmail').value;
    const position = document.getElementById('empPosition').value;
    const dept = document.getElementById('empDept').value;
    const hireDate = document.getElementById('empHireDate').value;

    // Create a new table row
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${email.split('@')[0]}</td> <td>${position}</td>
        <td>${dept}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary">Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()">Delete</button>
        </td>
    `;

    // Remove the "No employees" placeholder if it exists
    if (employeeTableBody.innerText.includes("No employees.")) {
        employeeTableBody.innerHTML = "";
    }

    // Add to table
    employeeTableBody.appendChild(newRow);

    // Reset form and show success
    employeeForm.reset();
    alert("Employee saved successfully!");
});

// 3. CANCEL BUTTON
document.getElementById('cancelEmpBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the form?")) {
        employeeForm.reset();
    }
});
