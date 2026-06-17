# 🏥 MediCare HMS — Hospital Management System

A full-featured Hospital Management System built with **Laravel 13**, **Inertia.js**, and **React**, styled with **Tailwind CSS**. It covers the day-to-day workflows of a hospital: patient registration, appointments, medical records, billing, pharmacy, lab, ward/bed management, admissions, staff & role management, and reporting.

---

## ✨ Features

| Module | What it does |
|---|---|
| **Dashboard** | Live stats (patients, doctors, today's appointments, pending bills, admissions, low-stock meds) + upcoming appointments and recent patients |
| **Patients** | Register, search, edit and view patients with demographics, emergency contacts, allergies and history |
| **Doctors** | Manage doctors (each gets a login), specialization, department and availability |
| **Departments** | Clinical/operational departments |
| **Appointments** | Schedule OPD / follow-up / emergency visits with status tracking |
| **Medical Records** | Visit notes, symptoms, diagnosis and prescriptions per patient |
| **Billing** | Invoices with line items, payments, balance and status (pending / partial / paid / cancelled) |
| **Pharmacy** | Medicine inventory with stock levels, reorder alerts, pricing and expiry |
| **Lab** | Test catalog + lab orders with results and status |
| **Wards & Admissions** | Bed capacity tracking and inpatient (IPD) admission/discharge |
| **Staff** | Create system users and assign roles |
| **Reports** | Revenue, bills by status, appointments by department, top doctors |

### 🔐 Roles & access

Six roles drive what each user can see and do:

- **Administrator** — full access to everything
- **Doctor**, **Nurse**, **Receptionist** — clinical modules (patients, appointments, records, lab orders, billing, admissions)
- **Pharmacist** — pharmacy inventory
- **Lab Technician** — lab test catalog

Access is enforced server-side via a `role:` middleware, and the sidebar only shows the modules a user is allowed to use.

---

## 🧰 Tech stack

- **Backend:** Laravel 13 (PHP 8.3+)
- **Frontend:** React 18 + Inertia.js (SPA-style, no separate API)
- **Styling:** Tailwind CSS + lucide-react icons
- **Build tool:** Vite 8
- **Auth:** Laravel Breeze
- **Database:** SQLite by default (easily switchable to MySQL/PostgreSQL)

---

## 🚀 Getting started

### Prerequisites

- PHP **8.3+** with the usual Laravel extensions
- Composer
- Node.js **18+** and npm

> On Windows, **XAMPP** already ships PHP — just make sure PHP is on your `PATH`.

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dicksonace/GT_Hospital_MS-.git
cd GT_Hospital_MS-

# 2. Install PHP dependencies
composer install

# 3. Install JavaScript dependencies
npm install

# 4. Create your environment file
cp .env.example .env          # Windows (cmd): copy .env.example .env

# 5. Generate the application key
php artisan key:generate

# 6. Create the database file (SQLite default)
#    Windows (PowerShell): New-Item database/database.sqlite
#    macOS/Linux:          touch database/database.sqlite

# 7. Run migrations and seed demo data
php artisan migrate --seed

# 8. Build the frontend assets
npm run build
```

### Running the app

**Option A — one command (recommended for development):**

```bash
composer run dev
```

This runs the PHP server, queue worker, log viewer and Vite dev server together.

**Option B — run separately in two terminals:**

```bash
php artisan serve     # terminal 1  → http://localhost:8000
npm run dev           # terminal 2  → Vite dev server with hot reload
```

Then open **http://localhost:8000** in your browser.

---

## 👤 Demo accounts

After seeding, you can log in with any of these (password is `password` for all):

| Role | Email |
|---|---|
| Administrator | `admin@hospital.test` |
| Receptionist | `reception@hospital.test` |
| Nurse | `nurse@hospital.test` |
| Pharmacist | `pharmacist@hospital.test` |
| Lab Technician | `lab@hospital.test` |
| Doctor | `doctor1@hospital.test` … `doctor4@hospital.test` |

> Log in as **admin@hospital.test** to see every module.

The seeder also creates sample departments, doctors, wards, medicines, lab tests, patients, appointments and bills so the dashboard and lists are populated immediately.

---

## 🗂️ How it works

- **Inertia.js** connects the Laravel backend to React without building a separate API. Controllers return `Inertia::render('Page', [...props])`, and the matching React page lives in `resources/js/Pages`.
- **Routing & access:** All HMS routes are defined in `routes/web.php` behind `auth` + `verified` middleware. Admin-only and role-specific areas are wrapped in the `role:` middleware (`app/Http/Middleware/EnsureUserHasRole.php`).
- **Numbering:** Patients, appointments, bills, lab orders and admissions get auto-generated reference numbers (e.g. `PAT00001`, `APT00001`, `BIL00001`) via `app/Support/NumberGenerator.php`.
- **Enums** (`app/Enums`) define statuses and types (roles, appointment/bill/lab/admission status, gender) and are cast on the Eloquent models.

### Project structure

```
app/
├── Enums/                # UserRole, AppointmentStatus, BillStatus, etc.
├── Http/
│   ├── Controllers/      # One controller per module
│   └── Middleware/       # EnsureUserHasRole (role-based access)
├── Models/               # Patient, Doctor, Appointment, Bill, Ward, ...
└── Support/              # NumberGenerator
database/
├── migrations/           # HMS schema (patients, appointments, bills, ...)
└── seeders/              # DatabaseSeeder with demo data
resources/js/
├── Components/           # Reusable UI (Card, PageHeader, Pagination, ...)
├── Layouts/              # AuthenticatedLayout (sidebar) + GuestLayout
└── Pages/                # Module pages (Index/Create/Edit/Show)
routes/
└── web.php               # All application routes
```

---

## 🧪 Tests

```bash
php artisan test
```

---

## 🔁 Resetting the database

To wipe everything and reseed fresh demo data:

```bash
php artisan migrate:fresh --seed
```

---

## 🛢️ Using MySQL instead of SQLite

Edit `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospital_ms
DB_USERNAME=root
DB_PASSWORD=
```

Create the `hospital_ms` database, then run `php artisan migrate --seed`.

---

## 📄 License

Open-sourced under the [MIT license](https://opensource.org/licenses/MIT).
