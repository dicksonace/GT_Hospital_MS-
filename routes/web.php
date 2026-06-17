<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\LabOrderController;
use App\Http\Controllers\LabTestController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\WardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    // Patient & clinical staff accessible modules
    Route::resource('patients', PatientController::class);
    Route::resource('appointments', AppointmentController::class);
    Route::resource('medical-records', MedicalRecordController::class)->parameters([
        'medical-records' => 'medicalRecord',
    ]);

    // Lab module
    Route::resource('lab-orders', LabOrderController::class)->parameters([
        'lab-orders' => 'labOrder',
    ]);

    // Billing
    Route::resource('bills', BillController::class);

    // Admissions
    Route::resource('admissions', AdmissionController::class);

    // Pharmacy & lab catalogs (manage)
    Route::middleware('role:pharmacist')->group(function () {
        Route::resource('medicines', MedicineController::class)->except(['show']);
    });

    Route::middleware('role:lab_technician')->group(function () {
        Route::resource('lab-tests', LabTestController::class)->except(['show'])->parameters([
            'lab-tests' => 'labTest',
        ]);
    });

    // Admin-only management
    Route::middleware('role:admin')->group(function () {
        Route::resource('departments', DepartmentController::class)->except(['show']);
        Route::resource('doctors', DoctorController::class);
        Route::resource('wards', WardController::class)->except(['show']);
        Route::resource('staff', StaffController::class)->except(['show'])->parameters([
            'staff' => 'staff',
        ]);
        Route::get('/reports', ReportController::class)->name('reports.index');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
