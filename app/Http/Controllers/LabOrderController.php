<?php

namespace App\Http\Controllers;

use App\Enums\LabOrderStatus;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\LabOrder;
use App\Models\LabTest;
use App\Models\Patient;
use App\Support\NumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();

        $labOrders = LabOrder::with(['patient', 'doctor.user', 'labTest'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->when($status->isNotEmpty(), fn ($q) => $q->where('status', $status->toString()))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('LabOrders/Index', [
            'labOrders' => $labOrders,
            'filters' => ['search' => $search->toString(), 'status' => $status->toString()],
            'statuses' => collect(LabOrderStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LabOrders/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'labTests' => LabTest::where('is_active', true)->orderBy('name')->get(),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
            'statuses' => collect(LabOrderStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'lab_test_id' => ['required', 'exists:lab_tests,id'],
            'status' => ['required', 'in:'.implode(',', array_column(LabOrderStatus::cases(), 'value'))],
            'result' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        LabOrder::create([
            ...$data,
            'order_number' => NumberGenerator::next('LAB', LabOrder::class, 'order_number'),
            'ordered_at' => now(),
            'completed_at' => $data['status'] === LabOrderStatus::Completed->value ? now() : null,
        ]);

        return redirect()->route('lab-orders.index')->with('success', 'Lab order created successfully.');
    }

    public function show(LabOrder $labOrder): Response
    {
        $labOrder->load(['patient', 'doctor.user', 'labTest', 'appointment']);

        return Inertia::render('LabOrders/Show', [
            'labOrder' => $labOrder,
            'statuses' => collect(LabOrderStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function edit(LabOrder $labOrder): Response
    {
        $labOrder->load(['patient', 'doctor.user', 'labTest']);

        return Inertia::render('LabOrders/Edit', [
            'labOrder' => $labOrder,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'labTests' => LabTest::where('is_active', true)->orderBy('name')->get(),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
            'statuses' => collect(LabOrderStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function update(Request $request, LabOrder $labOrder): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'lab_test_id' => ['required', 'exists:lab_tests,id'],
            'status' => ['required', 'in:'.implode(',', array_column(LabOrderStatus::cases(), 'value'))],
            'result' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        if ($data['status'] === LabOrderStatus::Completed->value && ! $labOrder->completed_at) {
            $data['completed_at'] = now();
        }

        $labOrder->update($data);

        return redirect()->route('lab-orders.show', $labOrder)->with('success', 'Lab order updated successfully.');
    }

    public function destroy(LabOrder $labOrder): RedirectResponse
    {
        $labOrder->delete();

        return redirect()->route('lab-orders.index')->with('success', 'Lab order deleted successfully.');
    }
}
