const API = "/api";

let patients = [];
let doctors = [];


/* PAGE NAVIGATION */

function showPage(page) {

    document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));

    document.getElementById(page)
        .classList.add("active");

    document.getElementById("pageTitle")
        .innerText =
        page.charAt(0).toUpperCase()
        + page.slice(1);

}


/* API FUNCTION */

async function api(url, options = {}) {

    const response =
        await fetch(API + url, {

            headers: {
                "Content-Type":
                    "application/json"
            },

            ...options

        });

    const data =
        await response.json();

    if (!response.ok) {
        alert(data.error);
        throw new Error(data.error);
    }

    return data;
}


/* DASHBOARD */

async function loadDashboard() {

    const data =
        await api("/dashboard");

    document.getElementById(
        "patientsCount"
    ).innerText = data.patients;

    document.getElementById(
        "doctorsCount"
    ).innerText = data.doctors;

    document.getElementById(
        "waitingCount"
    ).innerText = data.waiting;

    document.getElementById(
        "appointmentsCount"
    ).innerText =
        data.appointments;

    document.getElementById(
        "completedCount"
    ).innerText =
        data.completed;

    document.getElementById(
        "revenueCount"
    ).innerText =
        "₹" + data.revenue;

    document.getElementById(
        "emergencyCount"
    ).innerText =
        data.emergency;
}


/* PATIENTS */

async function loadPatients() {

    patients =
        await api("/patients");

    let html = `
        <table>

        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Phone</th>
            <th>Symptoms</th>
        </tr>
    `;

    patients.forEach(p => {

        html += `
            <tr>

                <td>${p.id}</td>

                <td>${p.name}</td>

                <td>${p.age || "-"}</td>

                <td>${p.gender}</td>

                <td>${p.phone}</td>

                <td>${p.symptoms}</td>

            </tr>
        `;

    });

    html += "</table>";

    document.getElementById(
        "patientTable"
    ).innerHTML = html;

    fillPatientSelects();
}


/* REGISTER PATIENT */

document.getElementById(
    "patientForm"
).addEventListener("submit",

async function(e) {

    e.preventDefault();

    const data =
        Object.fromEntries(
            new FormData(this)
        );

    await api("/patients", {

        method: "POST",

        body: JSON.stringify(data)

    });

    this.reset();

    alert("Patient registered successfully");

    loadPatients();
    loadDashboard();

});


/* DOCTORS */

async function loadDoctors() {

    doctors =
        await api("/doctors");

    let html = `
        <table>

        <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Status</th>
        </tr>
    `;

    doctors.forEach(d => {

        html += `
            <tr>

                <td>${d.name}</td>

                <td>
                    ${d.specialization}
                </td>

                <td>${d.phone}</td>

                <td>
                    ${d.available
                        ? "Available"
                        : "Unavailable"}
                </td>

            </tr>
        `;

    });

    html += "</table>";

    document.getElementById(
        "doctorTable"
    ).innerHTML = html;

    document.getElementById(
        "appointmentDoctor"
    ).innerHTML = doctors.map(d =>

        `<option value="${d.id}">
            ${d.name} -
            ${d.specialization}
        </option>`

    ).join("");
}


/* ADD DOCTOR */

document.getElementById(
    "doctorForm"
).addEventListener("submit",

async function(e) {

    e.preventDefault();

    const data =
        Object.fromEntries(
            new FormData(this)
        );

    await api("/doctors", {

        method: "POST",

        body: JSON.stringify(data)

    });

    this.reset();

    alert("Doctor added");

    loadDoctors();
    loadDashboard();

});


/* SELECT PATIENTS */

function fillPatientSelects() {

    const options =
        patients.map(p =>

            `<option value="${p.id}">
                ${p.name}
            </option>`

        ).join("");

    document.getElementById(
        "appointmentPatient"
    ).innerHTML = options;

    document.getElementById(
        "queuePatient"
    ).innerHTML = options;

    document.getElementById(
        "billPatient"
    ).innerHTML = options;

    document.getElementById(
        "recordPatient"
    ).innerHTML = options;
}


/* APPOINTMENTS */

async function loadAppointments() {

    const appointments =
        await api("/appointments");

    let html = `
        <table>

        <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
        </tr>
    `;

    appointments.forEach(a => {

        html += `
            <tr>

                <td>
                    ${a.patient_name}
                </td>

                <td>
                    ${a.doctor_name}
                </td>

                <td>
                    ${a.appointment_date}
                </td>

                <td>
                    ${a.appointment_time}
                </td>

                <td>
                    ${a.status}
                </td>

            </tr>
        `;

    });

    html += "</table>";

    document.getElementById(
        "appointmentTable"
    ).innerHTML = html;
}


/* BOOK APPOINTMENT */

document.getElementById(
    "appointmentForm"
).addEventListener("submit",

async function(e) {

    e.preventDefault();

    const data =
        Object.fromEntries(
            new FormData(this)
        );

    await api("/appointments", {

        method: "POST",

        body: JSON.stringify(data)

    });

    this.reset();

    alert("Appointment booked");

    loadAppointments();
    loadDashboard();

});


/* QUEUE */

async function loadQueue() {

    const queue =
        await api("/queue");

    let html = `
        <table>

        <tr>
            <th>Queue No</th>
            <th>Patient</th>
            <th>Status</th>
        </tr>
    `;

    queue.forEach(q => {

        html += `
            <tr>

                <td>
                    A-${q.queue_no}
                </td>

                <td>
                    ${q.patient_name}
                </td>

                <td>
                    ${q.status}
                </td>

            </tr>
        `;

    });

    html += "</table>";

    document.getElementById(
        "queueTable"
    ).innerHTML = html;
}


/* ADD QUEUE */

document.getElementById(
    "queueForm"
).addEventListener("submit",

async function(e) {

    e.preventDefault();

    const form =
        new FormData(this);

    const data = {
        patient_id:
            form.get("patient_id"),

        emergency:
            form.get("emergency")
            === "on"
    };

    await api("/queue", {

        method: "POST",

        body: JSON.stringify(data)

    });

    this.reset();

    alert("Queue number generated");

    loadQueue();
    loadDashboard();

});


/* BILLING */

async function loadBills() {

    const bills =
        await api("/bills");

    let html = `
        <table>

        <tr>
            <th>Patient</th>
            <th>Consultation</th>
            <th>Tests</th>
            <th>Medicines</th>
            <th>Total</th>
            <th>Payment</th>
        </tr>
    `;

    bills.forEach(b => {

        html += `
            <tr>

                <td>${b.patient_name}</td>

                <td>₹${b.consultation}</td>

                <td>₹${b.tests}</td>

                <td>₹${b.medicines}</td>

                <td>
                    <b>₹${b.total}</b>
                </td>

                <td>
                    ${b.payment_method}
                </td>

            </tr>
        `;

    });

    html += "</table>";

    document.getElementById(
        "billTable"
    ).innerHTML = html;
}


/* CREATE BILL */

document.getElementById(
    "billForm"
).addEventListener("submit",

async function(e) {

    e.preventDefault();

    const data =
        Object.fromEntries(
            new FormData(this)
        );

    await api("/bills", {

        method: "POST",

        body: JSON.stringify(data)

    });

    this.reset();

    alert("Bill generated");

    loadBills();
    loadDashboard();

});


/* MEDICAL RECORD */

async function loadRecord() {

    const id =
        document.getElementById(
            "recordPatient"
        ).value;

    const data =
        await api("/records/" + id);

    document.getElementById(
        "recordOutput"
    ).innerHTML = `

        <hr>

        <h3>
            ${data.patient.name}
        </h3>

        <p>
            Age:
            ${data.patient.age}
        </p>

        <p>
            Gender:
            ${data.patient.gender}
        </p>

        <p>
            Phone:
            ${data.patient.phone}
        </p>

        <p>
            Symptoms:
            ${data.patient.symptoms}
        </p>

        <h3>Appointments</h3>

        ${
            data.appointments.map(a =>

                `<p>
                    ${a.appointment_date}
                    -
                    ${a.status}
                </p>`

            ).join("")
        }

        <h3>Bills</h3>

        ${
            data.bills.map(b =>

                `<p>
                    Bill #${b.id}
                    -
                    ₹${b.total}
                </p>`

            ).join("")
        }

    `;
}


/* INITIAL LOAD */

document.getElementById(
    "today"
).innerText =
    new Date().toLocaleDateString();

showPage("dashboard");

loadDashboard();
loadPatients();
loadDoctors();
loadAppointments();
loadQueue();
loadBills();