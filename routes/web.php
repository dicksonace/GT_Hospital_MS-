<?php

use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\CheckupController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\LabOrderController;
use App\Http\Controllers\LabTestController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\NurseNoteController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\WardController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return Inertia::render('Welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('role:admin,doctor,nurse,receptionist')->group(function () {
        Route::resource('patients', PatientController::class);
        Route::resource('appointments', AppointmentController::class);
        Route::resource('checkups', CheckupController::class)->parameters([
            'checkups' => 'checkup',
        ]);
        Route::resource('admissions', AdmissionController::class);
        Route::resource('lab-orders', LabOrderController::class)->parameters([
            'lab-orders' => 'labOrder',
        ]);
    });

    Route::middleware('role:admin,doctor,nurse')->group(function () {
        Route::resource('medical-records', MedicalRecordController::class)->parameters([
            'medical-records' => 'medicalRecord',
        ]);
        Route::resource('nurse-notes', NurseNoteController::class)->parameters([
            'nurse-notes' => 'nurseNote',
        ]);
    });

    Route::middleware('role:admin,doctor,receptionist')->group(function () {
        Route::post('bills/{bill}/mark-paid', [BillController::class, 'markPaid'])->name('bills.mark-paid');
        Route::resource('bills', BillController::class);
    });

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
        Route::resource('nurses', NurseController::class);
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
