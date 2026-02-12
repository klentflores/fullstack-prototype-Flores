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

    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(targetId);

    if (targetPage) {

        targetPage.classList.add('active');
    }
}

window.addEventListener('hashchange', handleRoute);

window.addEventListener('load', handleRoute);

function setAuthState(isAuthenticated, user = null) {

    const body = document.body;
    
    if (isAuthenticated && user) {

        body.classList.remove('not-authenticated');

        body.classList.add('authenticated');

        body.classList.add('is-admin');

        document.getElementById('profileName').innerText = `${user.firstName} ${user.lastName}`;

        document.getElementById('displayEmail').innerText = user.email;

        document.getElementById('displayRole').innerText = "Admin";
        
        localStorage.setItem('currentUser', JSON.stringify(user));

    } else {

        body.classList.replace('authenticated', 'not-authenticated');

        body.classList.remove('is-admin');

        localStorage.removeItem('currentUser');

    }
}

//Login Form
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


//Register Form
const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const newUser = {

        firstName: document.getElementById('regFirst').value,

        lastName: document.getElementById('regLast').value,

        email: document.getElementById('regEmail').value,

        password: document.getElementById('regPass').value,

        role: 'Admin'

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

document.getElementById('simulateVerifyBtn').addEventListener('click', () => {

    window.location.hash = '#/login';

});

document.getElementById('logoutBtn').addEventListener('click', () => {

    setAuthState(false);

    window.location.hash = '#/';

    alert("Logged out successfully.");

});

//Employees Form
function toggleFormInputs(form, isDisabled) {

    const inputs = form.querySelectorAll('input, select, textarea, button');

    inputs.forEach(input => input.disabled = isDisabled);
}

    const employeeForm = document.getElementById('employeeForm');

    const employeeTableBody = document.querySelector('#employees-page table tbody');

    const cancelEmpBtn = document.getElementById('cancelEmpBtn');

    cancelEmpBtn.disabled = true;

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

    cancelEmpBtn.addEventListener('click', (e) => {

        e.preventDefault(); 

        if (confirm("Are you sure you want to cancel the form?")) {

            employeeForm.reset();

            toggleFormInputs(employeeForm, true);
            
            console.log("Form cancelled and locked.");

        }
});


//Department Form
function toggleDeptInputs(isDisabled) {

    const inputs = deptForm.querySelectorAll('input, textarea, button');

    inputs.forEach(input => input.disabled = isDisabled);
}

    const deptForm = document.getElementById('deptForm');

    const deptTableBody = document.getElementById('deptTableBody');

    const cancelDeptBtn = document.getElementById('cancelDeptBtn');

    cancelDeptBtn.disabled = true;

    const deptName = document.getElementById('deptName');

    const deptDesc = document.getElementById('deptDesc');

    document.getElementById('addDeptBtn').addEventListener('click', () => {

        toggleDeptInputs(false);

        deptName.focus();

});

deptForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const name = deptName.value;

    const desc = deptDesc.value;

    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${name}</td>
        <td>${desc}</td>
        <td>
            <button class="btn btn-sm btn-outline-primary edit-btn">Edit</button>
            <button class="btn btn-sm btn-outline-danger delete-btn">Delete</button>
        </td>
    `;

    if (deptTableBody.innerText.includes("No departments.")) deptTableBody.innerHTML = "";

    deptTableBody.appendChild(row);


    row.querySelector('.delete-btn').addEventListener('click', () => {

        if (confirm("Delete this department?")) row.remove();

    });

    row.querySelector('.edit-btn').addEventListener('click', () => {

        deptName.value = name;

        deptDesc.value = desc;

        toggleDeptInputs(false);

        row.remove();

    });


    deptForm.reset();

    toggleDeptInputs(true);

});

cancelDeptBtn.addEventListener('click', (e) => {

    e.preventDefault();

    if (confirm("Are you sure you want to cancel the form?")) {

        deptForm.reset();
        
        toggleDeptInputs(true);

        console.log("Form cancelled and locked.");
    }
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