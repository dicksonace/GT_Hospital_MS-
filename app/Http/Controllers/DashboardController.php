<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Enums\BillStatus;
use App\Enums\LabOrderStatus;
use App\Models\Admission;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\Doctor;
use App\Models\LabOrder;
use App\Models\Medicine;
use App\Models\Patient;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $today = now()->toDateString();

        return Inertia::render('Dashboard', [
            'stats' => [
                'patients' => Patient::count(),
                'doctors' => Doctor::count(),
                'appointments_today' => Appointment::whereDate('appointment_date', $today)->count(),
                'pending_bills' => Bill::whereIn('status', [BillStatus::Pending, BillStatus::Partial])->count(),
                'low_stock_medicines' => Medicine::whereColumn('stock_quantity', '<=', 'reorder_level')->count(),
                'pending_lab_orders' => LabOrder::where('status', LabOrderStatus::Pending)->count(),
                'active_admissions' => Admission::where('status', 'admitted')->count(),
            ],
            'recentAppointments' => Appointment::with(['patient', 'doctor.user', 'department'])
                ->whereDate('appointment_date', '>=', $today)
                ->orderBy('appointment_date')
                ->orderBy('appointment_time')
                ->limit(8)
                ->get(),
            'recentPatients' => Patient::latest()->limit(5)->get(),
        ]);
    }
}
