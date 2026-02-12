/**
 * PHASE 1: CORE ROUTING
 * A clean map of routes to Section IDs as per the Phase 8 Checklist.
 */
const routes = {
    '#/': 'home-page',
    '#/login': 'login-page',
    '#/register': 'register-page',
    '#/verify-email': 'verify-email-page',
    '#/profile': 'profile-page',
    '#/employees': 'employees-page',
    '#/accounts': 'accounts-page',
    '#/departments': 'departments-page',
    '#/requests': 'requests-page'
};

function handleRoute() {
    const hash = window.location.hash || '#/';
    const targetId = routes[hash] || 'home-page';

    // Hide all pages by removing the 'active' class
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    // Show the target page
    const targetPage = document.getElementById(targetId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

// Global Switches: Listen for URL changes and Page load
window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

/**
 * PHASE 2: AUTHENTICATION (FORCED ADMIN)
 * This function controls the "Ghost Stack" CSS classes on the body tag.
 */
function setAuthState(isAuthenticated, user = null) {
    const body = document.body;
    
    if (isAuthenticated && user) {
        // Switch from public to private view
        body.classList.remove('not-authenticated');
        body.classList.add('authenticated');
        
        // FORCED ADMIN LOGIC: Every user gets Admin visibility
        body.classList.add('is-admin');

        // Update UI placeholders
        document.getElementById('profileName').innerText = `${user.firstName} ${user.lastName}`;
        document.getElementById('displayEmail').innerText = user.email;
        document.getElementById('displayRole').innerText = "Admin";
        
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        // Logout state: Hide everything
        body.classList.replace('authenticated', 'not-authenticated');
        body.classList.remove('is-admin');
        localStorage.removeItem('currentUser');
    }
}

// --- Login Handler ---
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Invalid email or password!");
        return;
    }

    alert(`Welcome back, ${user.firstName}!`);
    setAuthState(true, user);
    window.location.hash = '#/profile';
});

    document.getElementById('cancelLogin').addEventListener('click', () => {
        
    document.body.classList.replace('authenticated', 'not-authenticated');
        
        loginForm.reset();

        window.location.hash = '#/';

        alert("Login Cancelled.");

});


// --- Register Handler (Forcing Admin Role) ---
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUser = {
        firstName: document.getElementById('regFirst').value,
        lastName: document.getElementById('regLast').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPass').value,
        role: 'Admin' // <--- Set to Admin automatically
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('verifyEmailText').innerText = newUser.email;
    window.location.hash = '#/verify-email';
});

        document.getElementById('cancelRegister').addEventListener('click', () => {

         alert("Register Cancelled.");

        window.location.hash = '#/login';

});

// --- Auth UI Helpers ---
document.getElementById('simulateVerifyBtn').addEventListener('click', () => {
    window.location.hash = '#/login';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    setAuthState(false);
    window.location.hash = '#/';
    alert("Logged out successfully.");
});

/**
 * PHASE 3: ADMIN MANAGEMENT (CRUD)
 */
function toggleFormInputs(form, isDisabled) {
    const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"]');
    inputs.forEach(input => input.disabled = isDisabled);
}

// --- Employee Table Management ---
const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.querySelector('#employees-page table tbody');

document.getElementById('addEmployeeBtn').addEventListener('click', () => {
    toggleFormInputs(employeeForm, false);
    document.getElementById('empId').focus();
});

employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const email = document.getElementById('empEmail').value;
    const position = document.getElementById('empPosition').value;
    const dept = document.getElementById('empDept').value;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${id}</td>
        <td>${email.split('@')[0]}</td> 
        <td>${position}</td>
        <td>${dept}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        </td>`;

    if (employeeTableBody.innerText.includes("No employees.")) employeeTableBody.innerHTML = "";
    employeeTableBody.appendChild(row);

    // Event Delegation: Add listeners to the new row
    row.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm("Delete this employee?")) row.remove();
    });
    row.querySelector('.edit-btn').addEventListener('click', () => {
        document.getElementById('empId').value = id;
        document.getElementById('empPosition').value = position;
        document.getElementById('empDept').value = dept;
        toggleFormInputs(employeeForm, false);
        row.remove();
    });

    employeeForm.reset();
    toggleFormInputs(employeeForm, true);
});

/**
 * PHASE 7: REQUESTS (USER ZONE)
 */
const requestForm = document.getElementById('requestForm');
const itemsContainer = document.getElementById('itemsContainer');

itemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-item-btn')) {
        const div = document.createElement('div');
        div.className = 'input-group mb-2 item-row';
        div.innerHTML = `
            <input type="text" class="form-control" placeholder="Item name" required>
            <input type="number" class="form-control" value="1" style="max-width: 70px;">
            <button class="btn btn-outline-danger remove-item-btn" type="button">×</button>`;
        itemsContainer.appendChild(div);
    } 
    if (e.target.classList.contains('remove-item-btn')) e.target.closest('.item-row').remove();
});

requestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('reqType').value;
    const count = itemsContainer.querySelectorAll('.item-row').length;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${count} Items</td>
        <td><span class="badge bg-warning">Pending</span></td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()">Cancel</button></td>`;
    
    document.getElementById('emptyRequests').classList.add('d-none');
    document.getElementById('requestTableContainer').classList.remove('d-none');
    document.getElementById('requestTableBody').appendChild(row);

    bootstrap.Modal.getInstance(document.getElementById('newRequestModal')).hide();
    requestForm.reset();
});