let STORAGE_KEY = 'ipt_demo_v1';
let currentUser = null; 
let editingDeptIndex = null;
let editingAccountIndex = null;
let editingEmployeeIndex = null;

window.db = { accounts: [], departments: [], employees: [], requests: [] };

function saveToStorage() {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
}

function loadFromStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData) {

        window.db = JSON.parse(savedData);

    } else {

        window.db.accounts.push({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'Password123!',
            role: 'Admin',
            verified: true
        });

        window.db.departments = [ { name: 'Engineering', desc: 'Technical department' }, { name: 'HR', desc: 'Human Resources' } ];

        saveToStorage();
    }
}

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
    
    const adminRoutes = ['#/employees', '#/accounts', '#/departments'];
    if (adminRoutes.includes(hash) && (!currentUser || currentUser.role !== 'Admin')) {
        window.location.hash = '#/profile';
        return;
    }

    const targetId = routes[hash] || 'home-page';
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    
    const targetPage = document.getElementById(targetId);
    if (targetPage) targetPage.classList.add('active');

    if (hash === '#/profile') renderProfile();
}

function setAuthState(isAuthenticated, user = null) {
    const body = document.body;
    const navRoleLabel = document.getElementById('navRoleLabel');
    currentUser = isAuthenticated ? user : null;

    if (isAuthenticated && user) {
        body.classList.replace('not-authenticated', 'authenticated');

        if (navRoleLabel) {
            navRoleLabel.innerText = user.role; 
        }

        if (user.role === 'Admin') {
            body.classList.add('is-admin');

        } else {
            body.classList.remove('is-admin');
        }
        localStorage.setItem('auth_token', user.email);
        
    } else {
        body.classList.replace('authenticated', 'not-authenticated');
        body.classList.remove('is-admin');
        localStorage.removeItem('auth_token');
    }
}

//LOGIN PAGE
const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const user = window.db.accounts.find(u => u.email === email && u.password === pass);

    if (!user) {
        alert("Invalid email or password!");
        return;
     }
        localStorage.setItem("auth_token", email);
        setAuthState(true, user);
        window.location.hash = '#/profile';
});

document.getElementById('cancelLogin').addEventListener('click', () => {
    if (confirm("Cancel login and Return to home?")) {
        document.getElementById('loginForm').reset();
        window.location.hash = '#/';   
        document.getElementById('loginAlert').classList.add('d-none');
    }
});

//VERIFY EMAIL PAGE
document.getElementById('simulateVerifyBtn').addEventListener('click', () => {
    const email = localStorage.getItem('unverified_email');
    const user = window.db.accounts.find(u => u.email === email);
    if (user) {
        user.verified = true;
        saveToStorage();
        alert("Email Verified! Please Login.");
        window.location.hash = '#/login';
    }
});

//REGISTER PAGE
const registerForm = document.getElementById('registerForm');
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPass').value;

    if (window.db.accounts.find(u => u.email === email)) {
        return alert("Email already exists!");
    }
    if (password.length < 6) {
        return alert("Your password is too short. Use at least 6 characters.");
    }

    const newUser = {
        firstName: document.getElementById('regFirst').value,
        lastName: document.getElementById('regLast').value,
        email: email,
        password: document.getElementById('regPass').value,
        role: 'User',
        verified: false
    };

    window.db.accounts.push(newUser);
    localStorage.setItem('unverified_email', email);
    saveToStorage();

    document.getElementById('verifyEmailText').innerText = email;
    window.location.hash = '#/verify-email';
});
    document.getElementById('cancelRegister').addEventListener('click', () => {
    alert("Register Cancelled.");
    registerForm.reset();
    window.location.hash = '#/login';
});
//---------------------------------------------------------------------------------------------------------------//

//MY PROFILE PAGE
function renderProfile() {
    if (currentUser) {
        document.getElementById('profileName').innerText = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('displayEmail').innerText = currentUser.email;
        document.getElementById('displayRole').innerText = currentUser.role;
    }
}

//EMPLOYEES PAGE
function renderEmployeesTable() {
    const tableBody = document.querySelector("#employees-page tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    const employees = window.db.employees || [];

    if (employees.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="py-3 text-muted">No employees found.</td></tr>`;
        return;
    }

    employees.forEach((emp, index) => {
        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.email}</td>
                <td>${emp.position}</td>
                <td>${emp.dept}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editEmployee(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee(${index})">Delete</button>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

window.showEmployeeForm = function() {
    editingEmployeeIndex = null;
    const form = document.getElementById('employeeForm');

    form.reset();
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    document.getElementById('empId').focus();
};

window.editEmployee = function(index) {
    if (confirm("Edit this employee record?")) {
        const emp = window.db.employees[index];
        
        document.getElementById('empId').value = emp.id;
        document.getElementById('empEmail').value = emp.email;
        document.getElementById('empPosition').value = emp.position;
        document.getElementById('empDept').value = emp.dept;
        document.getElementById('empHireDate').value = emp.hireDate;

        const form = document.getElementById('employeeForm');
        form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
    }
};

window.deleteEmployee = function(index) {
    if (confirm("Are you sure you want to delete this employee?")) {
        window.db.employees.splice(index, 1);

        saveToStorage();
        renderEmployeesTable();
        hideEmployeeForm();
    }
};

window.saveEmployee = function() {
    const empData = {
        id: document.getElementById('empId').value,
        email: document.getElementById('empEmail').value,
        position: document.getElementById('empPosition').value,
        dept: document.getElementById('empDept').value,
        hireDate: document.getElementById('empHireDate').value
    };

    if (!empData.id || !empData.email) {
        alert("Please enter ID and Email.");
        return;
    }

    const existingIndex = window.db.employees.findIndex(emp => emp.id === empData.id);
    if (existingIndex > -1) {
        window.db.employees[existingIndex] = empData; 

    } else {
        window.db.employees.push(empData); 
    }

    saveToStorage();
    renderEmployeesTable();
    
    const form = document.getElementById('employeeForm');
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    
    alert("Employee saved successfully!");
};

window.resetEmployeeForm = function() {
    const form = document.getElementById('employeeForm');
    form.reset();
    
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    alert("Cancel complete.");
};

//ACCOUNT PAGE
function renderAccounts() {
    const tableBody = document.querySelector("#accounts-page tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";
    const accounts = window.db.accounts || [];
    
    accounts.forEach((acc, index) => {

        const isSystemAdmin = (acc.email === 'admin@example.com');
        const isDisabled = isSystemAdmin ? "disabled" : "";

        const row = `
            <tr>
                <td>${acc.firstName} ${acc.lastName}</td>
                <td>${acc.email}</td>
                <td>${acc.role}</td>
                <td>${acc.verified ? "✅" : "❌"}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editAccount(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-warning" onclick="resetPassword(${index})">Reset</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteAccount(${index})">Delete</button>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

window.showAccountForm = function() {
    editingAccountIndex = null;
    const form = document.getElementById('accountForm');

    form.reset();
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
};

window.editAccount = function(index) {
    const acc = window.db.accounts[index];
    
    if (acc.email === 'admin@example.com') return;

    if (confirm(`Edit account for ${acc.firstName}?`)) {
        editingAccountIndex = index;
        
        document.getElementById('accFirstName').value = acc.firstName;
        document.getElementById('accLastName').value = acc.lastName;
        document.getElementById('accEmail').value = acc.email;
        document.getElementById('accRole').value = acc.role;

        const verifiedCheckbox = document.getElementById("accVerified");

        if (verifiedCheckbox) {
            verifiedCheckbox.checked = acc.verified;
        }
        const form = document.getElementById('accountForm');

        if (form) {
            form.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
        }
        
        if (typeof showAccountForm === 'function') {
            showAccountForm();
        }
    }
};

window.resetPassword = function(index) {
    const acc = window.db.accounts[index];
    
    if (acc.email === 'admin@example.com') return;

    const newPass = prompt(`Enter new password for ${acc.email}:`, "");
    if (newPass) {
        window.db.accounts[index].password = newPass;
        saveToStorage();
        alert("Password updated successfully.");
    }
};

window.deleteAccount = function(index) {
    const acc = window.db.accounts[index];
    
    if (window.db.accounts[index].email === 'admin@example.com') return;

    if (confirm(`Are you sure you want to delete ${acc.firstName}?`)) {
        window.db.accounts.splice(index, 1);
        saveToStorage();
        renderAccounts();
    }
};

window.saveAccount = function() {
    const accData = {
        firstName: document.getElementById('accFirstName').value.trim(),
        lastName: document.getElementById('accLastName').value.trim(),
        email: document.getElementById('accEmail').value.trim(),
        password: document.getElementById("accPassword").value.trim(),
        role: document.getElementById('accRole').value,
        verified: document.getElementById('accVerified').checked
    };

    if (!accData.firstName || !accData.email) {
        alert("Please fill in the Name and Email.");
        return;
    }

    if (editingAccountIndex !== null) {
        const oldPass = window.db.accounts[editingAccountIndex].password;
        if (accData.password === "") {
            accData.password = oldPass;
        }
        window.db.accounts[editingAccountIndex] = accData;
        
    } else {
        window.db.accounts.push(accData);
    }

    saveToStorage();
    renderAccounts();
    
    const form = document.getElementById('accountForm');
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    alert("Account updated successfully!");
};

window.resetAccountForm = function() {
    const form = document.getElementById('accountForm');
    form.reset();
    
    form.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
    alert("Cancel complete.");
};

//DEPARTMENT PAGE
function renderDepartments() {
    const tableBody = document.getElementById("deptTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!window.db.departments || window.db.departments.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="py-3 text-muted text-center">No departments.</td></tr>';
        return;
    }

    window.db.departments.forEach((dept, index) => {
        const row = `
            <tr>
                <td><strong>${dept.name}</strong></td>
                <td>${dept.description}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editDepartment(${index})">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteDepartment(${index})">Delete</button>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

window.showDeptForm = function() {
    editingDeptIndex = null;
    const form = document.getElementById('deptForm');
    form.reset();

    form.querySelectorAll('input, textarea, button').forEach(el => {
        el.disabled = false;

    });
};

window.editDepartment = function(index) {
    if (confirm("Edit this department record?")) {
        editingDeptIndex = index;
        const dept = window.db.departments[index];
        
        document.getElementById('deptName').value = dept.name;
        document.getElementById('deptDesc').value = dept.description;

        const form = document.getElementById('deptForm');

        form.querySelectorAll('input,  textarea, select, button').forEach(el => el.disabled = false);
        document.getElementById('deptName').focus();
    }
};

window.deleteDepartment = function(index) {
    const dept = window.db.departments[index];

    if (confirm(`Are you sure you want to delete the "${dept.name}" department?`)) {
        window.db.departments.splice(index, 1);

        saveToStorage();
        renderDepartments();
    }
};

window.saveDept = function(e) {
    if (e) e.preventDefault(); 

    const name = document.getElementById('deptName').value;
    const desc = document.getElementById('deptDesc').value;

    const data = { name: name.trim(), description: desc.trim() };
    
    if (editingDeptIndex !== null) {
        window.db.departments[editingDeptIndex] = data;
    } else {
        window.db.departments.push(data);
    }

    saveToStorage();
    renderDepartments();

    alert("Department saved successfully!"); 

    window.cancelDept(); 
};

window.cancelDept = function() {
    editingDeptIndex = null;
    const form = document.getElementById('deptForm');

    if (form) {
        form.reset();
        form.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
    }
};









































//INIT
window.addEventListener('hashchange', handleRoute);
document.getElementById('logoutBtn').addEventListener('click', () => {
    setAuthState(false);
    window.location.hash = '#/';
});

window.addEventListener('load', () => {
    loadFromStorage();
    handleRoute();
   
    const token = localStorage.getItem('auth_token');
    if (token) {
        const user = window.db.accounts.find(a => a.email === token);
        if (user) setAuthState(true, user);
    }

    renderEmployeesTable();
    renderAccounts();
    renderDepartments();
});


