function handleRoute() {
    const hash = window.location.hash || '#/';
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Routing Logic
    const routes = {
        '#/login': 'login-page',
        '#/register': 'register-page',
        '#/verify-email': 'verify-email-page',
        '#/profile': 'profile-page',
        '#/employees': 'employees-page',
        '#/accounts': 'accounts-page',
        '#/departments': 'departments-page',
        '#/requests': 'requests-page'
    };

    const targetId = routes[hash] || 'home-page';
    const targetPage = document.getElementById(targetId);
    
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

//login Form
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === pass);

    if (user) {
        alert("Login Successful! Welcome Admin " + user.firstName);
        document.body.classList.remove('not-authenticated');
        document.body.classList.add('authenticated');

        //profile data or my profile
        document.getElementById('profileName').innerText = `${user.firstName} ${user.lastName}`;
        document.getElementById('displayEmail').innerText = user.email;
        document.getElementById('displayRole').innerText = "Admin";

        window.location.hash = '#/profile';
    } else {
        alert("Invalid email or password!");
    }
});

//register form
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUser = {
        firstName: document.getElementById('regFirst').value,
        lastName: document.getElementById('regLast').value,
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPass').value
    };

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('verifyEmailText').innerText = newUser.email;
    window.location.hash = '#/verify-email';
});

//email Verification
document.getElementById('simulateVerifyBtn').addEventListener('click', () => {
    const loginAlert = document.getElementById('loginAlert');
    if (loginAlert) loginAlert.classList.remove('d-none');
    window.location.hash = '#/login';
});

//logout Button
document.getElementById('logoutBtn').addEventListener('click', () => {
    document.body.classList.replace('authenticated', 'not-authenticated');
    window.location.hash = '#/';
    alert("Logged out to Home Page.");
});

//cancel Button
document.getElementById('cancelLogin').addEventListener('click', () => {
    loginForm.reset();
    alert("Login Cancelled.");
});

document.getElementById('cancelRegister').addEventListener('click', () => {
    window.location.hash = '#/login';
});

//employee form
const employeeForm = document.getElementById('employeeForm');
const employeeTableBody = document.querySelector('#employees-page table tbody');

function toggleFormInputs(isDisabled) {
    const inputs = employeeForm.querySelectorAll('input, select, button[type="submit"]');
    inputs.forEach(input => input.disabled = isDisabled);
}

//add employee button
document.getElementById('addEmployeeBtn').addEventListener('click', () => {
    toggleFormInputs(false); // Enable the fields
    document.getElementById('empId').focus();
});

//employee save button
employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('empId').value;
    const email = document.getElementById('empEmail').value;
    const position = document.getElementById('empPosition').value;
    const dept = document.getElementById('empDept').value;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${email.split('@')[0]}</td> 
        <td>${position}</td>
        <td>${dept}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        </td>
    `;

    // Remove placeholder text
    if (employeeTableBody.innerText.includes("No employees.")) {
        employeeTableBody.innerHTML = "";
    }

    employeeTableBody.appendChild(newRow);

    // Attach Confirmations to the new buttons
    addTableListeners(newRow);

    employeeForm.reset();
    toggleFormInputs(true); // Lock the fields again
    alert("Employee saved successfully!");
});

//employees form edit and delete buttons action
function addTableListeners(row) {
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    //employees form delete button actions
    deleteBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to DELETE this employee?")) {
            row.remove();

            if (employeeTableBody.children.length === 0) {
                employeeTableBody.innerHTML = '<tr><td colspan="5" class="py-3 text-muted">No employees.</td></tr>';
            }
        }
    });

    //employees form edit button actions
    editBtn.addEventListener('click', () => {
        if (confirm("Do you want to EDIT this employee's info?")) {
            const cells = row.querySelectorAll('td');
            

            document.getElementById('empId').value = cells[0].innerText;
            document.getElementById('empPosition').value = cells[2].innerText;
            document.getElementById('empDept').value = cells[3].innerText;
            
            toggleFormInputs(false);
            row.remove();
        }
    });
}

//employees form cancel button table 
document.getElementById('cancelEmpBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the form?")) {
        employeeForm.reset();
        toggleFormInputs(true);
    }
});

/**
 * SECTION 5: ACCOUNTS MANAGEMENT
 */
const accountForm = document.getElementById('accountForm');
const accountTableBody = document.getElementById('accountTableBody');

// Helper to toggle form state
function toggleAccountInputs(isDisabled) {
    const inputs = accountForm.querySelectorAll('input, select, #saveAccBtn');
    inputs.forEach(input => input.disabled = isDisabled);
}

// 1. ADD ACCOUNT BUTTON
document.getElementById('addAccountBtn').addEventListener('click', () => {
    toggleAccountInputs(false);
    document.getElementById('accFirst').focus();
});

// 2. SAVE ACCOUNT
accountForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const first = document.getElementById('accFirst').value;
    const last = document.getElementById('accLast').value;
    const email = document.getElementById('accEmail').value;
    const role = document.getElementById('accRole').value;
    const isVerified = document.getElementById('accVerified').checked ? '✅' : '❌';

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${first} ${last}</td>
        <td>${email}</td>
        <td>${role}</td>
        <td>${isVerified}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary edit-acc-btn">Edit</button>
            <button class="btn btn-sm btn-outline-warning">Reset Password</button>
            <button class="btn btn-sm btn-outline-danger delete-acc-btn">Delete</button>
        </td>
    `;

    accountTableBody.appendChild(row);
    addAccountListeners(row);

    accountForm.reset();
    toggleAccountInputs(true);
    alert("Account created successfully!");
});

// 3. EDIT & DELETE LISTENERS
function addAccountListeners(row) {
    row.querySelector('.delete-acc-btn').addEventListener('click', () => {
        if (confirm("Are you sure you want to delete this account?")) {
            row.remove();
        }
    });

    row.querySelector('.edit-acc-btn').addEventListener('click', () => {
        if (confirm("Edit this account?")) {
            // Logic to populate form goes here...
            toggleAccountInputs(false);
            row.remove();
        }
    });
}

// 4. CANCEL BUTTON
document.getElementById('cancelAccBtn').addEventListener('click', () => {
    accountForm.reset();
    toggleAccountInputs(true);
});



//department form
const deptForm = document.getElementById('deptForm');
const deptTableBody = document.getElementById('deptTableBody');

function toggleDeptInputs(isDisabled) {
    const inputs = deptForm.querySelectorAll('input, textarea, #saveDeptBtn');
    inputs.forEach(input => input.disabled = isDisabled);
}

//add department button
document.getElementById('addDeptBtn').addEventListener('click', () => {
    toggleDeptInputs(false);
    document.getElementById('deptName').focus();
});

//save department button
deptForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('deptName').value;
    const desc = document.getElementById('deptDesc').value;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${name}</td>
        <td>${desc}</td>
        <td class="text-center">
            <button class="btn btn-sm btn-outline-primary edit-dept-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-dept-btn">Delete</button>
        </td>
    `;

    if (deptTableBody.innerText.includes("No departments.")) {
        deptTableBody.innerHTML = "";
    }

    deptTableBody.appendChild(newRow);
    addDeptListeners(newRow);

    deptForm.reset();
    toggleDeptInputs(true);
    alert("Department added successfully!");
});

//edit and delete department buttons
function addDeptListeners(row) {
    const editBtn = row.querySelector('.edit-dept-btn');
    const deleteBtn = row.querySelector('.delete-dept-btn');

    deleteBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to DELETE this department?")) {
            row.remove();
            if (deptTableBody.children.length === 0) {
                deptTableBody.innerHTML = '<tr><td colspan="3" class="py-3 text-muted text-center">No departments.</td></tr>';
            }
        }
    });

    editBtn.addEventListener('click', () => {
        if (confirm("Do you want to EDIT this department?")) {
            const cells = row.querySelectorAll('td');
            document.getElementById('deptName').value = cells[0].innerText;
            document.getElementById('deptDesc').value = cells[1].innerText;
            
            toggleDeptInputs(false);
            row.remove();
        }
    });
}

//cancel department button
document.getElementById('cancelDeptBtn').addEventListener('click', () => {
    if (confirm("Discard changes?")) {
        deptForm.reset();
        toggleDeptInputs(true);
    }
});

/**
 * SECTION 6: REQUESTS MANAGEMENT
 */
const requestForm = document.getElementById('requestForm');
const itemsContainer = document.getElementById('itemsContainer');
const requestTableBody = document.getElementById('requestTableBody');
const emptyRequests = document.getElementById('emptyRequests');
const requestTableContainer = document.getElementById('requestTableContainer');

// 1. ADD/REMOVE DYNAMIC ITEM ROWS
itemsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-item-btn')) {
        const newRow = document.createElement('div');
        newRow.className = 'input-group mb-2 item-row';
        newRow.innerHTML = `
            <input type="text" class="form-control" placeholder="Item name" required>
            <input type="number" class="form-control" value="1" style="max-width: 70px;">
            <button class="btn btn-outline-danger remove-item-btn" type="button">×</button>
        `;
        itemsContainer.appendChild(newRow);
    } 
    
    if (e.target.classList.contains('remove-item-btn')) {
        e.target.closest('.item-row').remove();
    }
});

// 2. SUBMIT REQUEST
requestForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.getElementById('reqType').value;
    const itemCount = itemsContainer.querySelectorAll('.item-row').length;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${type}</td>
        <td>${itemCount} Items</td>
        <td><span class="badge bg-warning">Pending</span></td>
        <td>
            <button class="btn btn-sm btn-outline-danger" onclick="this.closest('tr').remove()">Cancel</button>
        </td>
    `;

    // Show table, hide empty message
    emptyRequests.classList.add('d-none');
    requestTableContainer.classList.remove('d-none');

    requestTableBody.appendChild(row);

    // Reset Form and Close Modal
    requestForm.reset();
    itemsContainer.innerHTML = `
        <div class="input-group mb-2 item-row">
            <input type="text" class="form-control" placeholder="Item name" required>
            <input type="number" class="form-control" value="1" style="max-width: 70px;">
            <button class="btn btn-outline-secondary add-item-btn" type="button">+</button>
        </div>
    `;
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('newRequestModal'));
    modal.hide();
    
    alert("Request submitted successfully!");
});