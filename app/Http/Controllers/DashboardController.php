<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentType;
use App\Enums\BillStatus;
use App\Enums\LabOrderStatus;
use App\Enums\UserRole;
use App\Models\Admission;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\Doctor;
use App\Models\LabOrder;
use App\Models\Medicine;
use App\Models\NurseNote;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $today = now()->toDateString();
        $user = $request->user();

        $appointments = Appointment::with(['patient', 'doctor.user', 'department'])
            ->when($user->hasRole(UserRole::Doctor) && $user->doctor, fn ($q) => $q->where('doctor_id', $user->doctor->id))
            ->whereDate('appointment_date', '>=', $today)
            ->orderBy('appointment_date')
            ->orderBy('appointment_time')
            ->limit(8)
            ->get();

        $nurseNotes = NurseNote::with(['patient', 'nurse.user'])
            ->when($user->hasRole(UserRole::Doctor) && $user->doctor, function ($query) use ($user) {
                $query->where(function ($q) use ($user) {
                    $q->where('doctor_id', $user->doctor->id)
                        ->orWhereHas('patient.appointments', fn ($a) => $a->where('doctor_id', $user->doctor->id))
                        ->orWhereHas('patient.admissions', fn ($a) => $a->where('doctor_id', $user->doctor->id));
                });
            })
            ->when($user->hasRole(UserRole::Nurse) && $user->nurse, fn ($q) => $q->where('nurse_id', $user->nurse->id))
            ->latest('recorded_at')
            ->limit(6)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'patients' => Patient::count(),
                'doctors' => Doctor::count(),
                'appointments_today' => Appointment::whereDate('appointment_date', $today)->count(),
                'checkups_today' => Appointment::where('type', AppointmentType::Checkup)->whereDate('appointment_date', $today)->count(),
                'pending_bills' => Bill::whereIn('status', [BillStatus::Pending, BillStatus::Partial])->count(),
                'low_stock_medicines' => Medicine::whereColumn('stock_quantity', '<=', 'reorder_level')->count(),
                'pending_lab_orders' => LabOrder::where('status', LabOrderStatus::Pending)->count(),
                'active_admissions' => Admission::where('status', 'admitted')->count(),
                'nurse_notes' => NurseNote::count(),
            ],
            'recentAppointments' => $appointments,
            'recentPatients' => Patient::latest()->limit(5)->get(),
            'recentNurseNotes' => $nurseNotes,
        ]);
    }
}
