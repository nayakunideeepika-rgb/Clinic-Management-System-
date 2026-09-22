// Sample Data Store
const state = {
    appointments: [
        { id: 1, name: 'Eleanor Pena', time: '09:00 AM', doctor: 'Dr. Sarah Jenkins', type: 'General Checkup', status: 'Confirmed' },
        { id: 2, name: 'Cody Fisher', time: '10:30 AM', doctor: 'Dr. Michael Chang', type: 'Dental Cleaning', status: 'Pending' },
        { id: 3, name: 'Wade Warren', time: '01:15 PM', doctor: 'Dr. Sarah Jenkins', type: 'Follow-up', status: 'Confirmed' },
        { id: 4, name: 'Robert Fox', time: '03:00 PM', doctor: 'Dr. Emily Stone', type: 'Consultation', status: 'Confirmed' }
    ],
    patients: [
        { id: 'P-1001', name: 'Eleanor Pena', age: 34, gender: 'Female', contact: '+1 555-0192', lastVisit: '2026-09-10' },
        { id: 'P-1002', name: 'Cody Fisher', age: 28, gender: 'Male', contact: '+1 555-0134', lastVisit: '2026-08-22' },
        { id: 'P-1003', name: 'Wade Warren', age: 45, gender: 'Male', contact: '+1 555-0188', lastVisit: '2026-09-15' },
        { id: 'P-1004', name: 'Robert Fox', age: 52, gender: 'Male', contact: '+1 555-0145', lastVisit: '2026-07-04' }
    ],
    prescriptions: [
        { id: 'RX-8801', patient: 'Eleanor Pena', medication: 'Amoxicillin 500mg', dosage: '1 tablet 3x daily', date: '2026-09-10' },
        { id: 'RX-8802', patient: 'Wade Warren', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', date: '2026-09-15' }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Render Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    renderDashboard();
    renderAppointments();
    renderPatients();
    renderPrescriptions();
});

// Tab Switcher
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    const navLink = document.querySelector(.nav-item[href="#${tabId}"]);
    if (navLink) {
        navLink.classList.add('active');
    }
}

// Render Dashboard Data
function renderDashboard() {
    const appContainer = document.getElementById('dashboard-appointments');
    const patContainer = document.getElementById('dashboard-patients');

    appContainer.innerHTML = state.appointments.slice(0, 3).map(app => `
        <li class="list-item">
            <div>
                <strong>${app.name}</strong>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${app.type}</p>
            </div>
            <span class="badge ${app.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'}">${app.time}</span>
        </li>
    `).join('');

    patContainer.innerHTML = state.patients.slice(0, 3).map(pat => `
        <li class="list-item">
            <div>
                <strong>${pat.name}</strong>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${pat.id} • ${pat.gender}, ${pat.age}</p>
            </div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">${pat.lastVisit}</span>
        </li>
    `).join('');
}

// Render Appointments Table
function renderAppointments() {
    const tbody = document.getElementById('appointments-table-body');
    tbody.innerHTML = state.appointments.map(app => `
        <tr>
            <td><strong>${app.name}</strong></td>
            <td>${app.time}</td>
            <td>${app.doctor}</td>
            <td>${app.type}</td>
            <td><span class="badge ${app.status === 'Confirmed' ? 'badge-confirmed' : 'badge-pending'}">${app.status}</span></td>
            <td><button class="btn-secondary" style="padding: 0.3rem 0.6rem;" onclick="deleteAppointment(${app.id})">Cancel</button></td>
        </tr>
    `).join('');
}

// Render Patients Table
function renderPatients() {
    const tbody = document.getElementById('patients-table-body');
    tbody.innerHTML = state.patients.map(pat => `
        <tr>
            <td>${pat.id}</td>
            <td><strong>${pat.name}</strong></td>
            <td>${pat.age} / ${pat.gender}</td>
            <td>${pat.contact}</td>
            <td>${pat.lastVisit}</td>
            <td><button class="btn-secondary" style="padding: 0.3rem 0.6rem;">View File</button></td>
        </tr>
    `).join('');
}

// Render Prescriptions Table
function renderPrescriptions() {
    const tbody = document.getElementById('prescriptions-table-body');
    tbody.innerHTML = state.prescriptions.map(rx => `
        <tr>
            <td>${rx.id}</td>
            <td><strong>${rx.patient}</strong></td>
            <td>${rx.medication}</td>
            <td>${rx.dosage}</td>
            <td>${rx.date}</td>
            <td><button class="btn-secondary" style="padding: 0.3rem 0.6rem;">Print</button></td>
        </tr>
    `).join('');
}

// Modal Handlers
function openAppointmentModal() {
    document.getElementById('modal-appointment').style.display = 'flex';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
}

// Form Handlers
function handleAppointmentSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('app-patient-name').value;
    const time = document.getElementById('app-time').value;
    const doctor = document.getElementById('app-doctor').value;
    const type = document.getElementById('app-type').value;

    const newApp = {
        id: Date.now(),
        name,
        time,
        doctor,
        type,
        status: 'Confirmed'
    };

    state.appointments.push(newApp);
    renderAppointments();
    renderDashboard();
    closeModals();
    event.target.reset();
}

function deleteAppointment(id) {
    state.appointments = state.appointments.filter(app => app.id !== id);
    renderAppointments();
    renderDashboard();
}