<?php

namespace App\Http\Controllers;

use App\Enums\BillStatus;
use App\Models\Admission;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\Doctor;
use App\Models\Medicine;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __invoke(): Response
    {
        $startOfMonth = now()->startOfMonth();

        $revenueByMonth = Bill::query()
            ->select(DB::raw("strftime('%Y-%m', issued_at) as month"), DB::raw('SUM(paid_amount) as revenue'))
            ->whereNotNull('issued_at')
            ->groupBy('month')
            ->orderBy('month')
            ->limit(12)
            ->get();

        return Inertia::render('Reports/Index', [
            'summary' => [
                'total_patients' => Patient::count(),
                'total_doctors' => Doctor::count(),
                'appointments_this_month' => Appointment::where('appointment_date', '>=', $startOfMonth)->count(),
                'total_revenue' => (float) Bill::sum('paid_amount'),
                'outstanding_balance' => (float) Bill::sum(DB::raw('total_amount - paid_amount')),
                'active_admissions' => Admission::where('status', 'admitted')->count(),
                'low_stock_medicines' => Medicine::whereColumn('stock_quantity', '<=', 'reorder_level')->count(),
            ],
            'billsByStatus' => collect(BillStatus::cases())->map(fn ($s) => [
                'status' => $s->label(),
                'count' => Bill::where('status', $s->value)->count(),
                'amount' => (float) Bill::where('status', $s->value)->sum('total_amount'),
            ]),
            'appointmentsByDepartment' => Appointment::query()
                ->select('departments.name', DB::raw('COUNT(appointments.id) as total'))
                ->join('departments', 'departments.id', '=', 'appointments.department_id')
                ->groupBy('departments.name')
                ->orderByDesc('total')
                ->get(),
            'revenueByMonth' => $revenueByMonth,
            'topDoctors' => Doctor::withCount('appointments')
                ->with('user')
                ->orderByDesc('appointments_count')
                ->limit(5)
                ->get(),
        ]);
    }
}
