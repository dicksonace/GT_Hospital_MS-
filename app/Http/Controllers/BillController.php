<?php

namespace App\Http\Controllers;

use App\Enums\BillStatus;
use App\Models\Appointment;
use App\Models\Bill;
use App\Models\BillItem;
use App\Models\Patient;
use App\Support\NumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();

        $bills = Bill::with(['patient', 'appointment'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('bill_number', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->when($status->isNotEmpty(), fn ($q) => $q->where('status', $status->toString()))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Bills/Index', [
            'bills' => $bills,
            'filters' => ['search' => $search->toString(), 'status' => $status->toString()],
            'statuses' => collect(BillStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Bills/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
            'statuses' => collect(BillStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'issued_at' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $bill = Bill::create([
            'bill_number' => NumberGenerator::next('BIL', Bill::class, 'bill_number'),
            'patient_id' => $data['patient_id'],
            'appointment_id' => $data['appointment_id'] ?? null,
            'paid_amount' => $data['paid_amount'] ?? 0,
            'status' => BillStatus::Pending,
            'issued_at' => $data['issued_at'] ?? now(),
            'due_at' => $data['due_at'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            BillItem::create([
                'bill_id' => $bill->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        $bill->recalculateTotals();

        return redirect()->route('bills.show', $bill)->with('success', 'Bill created successfully.');
    }

    public function show(Bill $bill): Response
    {
        $bill->load(['patient', 'appointment', 'items']);

        return Inertia::render('Bills/Show', [
            'bill' => $bill,
            'statuses' => collect(BillStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function edit(Bill $bill): Response
    {
        $bill->load(['items', 'patient']);

        return Inertia::render('Bills/Edit', [
            'bill' => $bill,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
            'statuses' => collect(BillStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function update(Request $request, Bill $bill): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['required', 'in:'.implode(',', array_column(BillStatus::cases(), 'value'))],
            'issued_at' => ['nullable', 'date'],
            'due_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.description' => ['required', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $bill->update([
            'patient_id' => $data['patient_id'],
            'appointment_id' => $data['appointment_id'] ?? null,
            'paid_amount' => $data['paid_amount'] ?? 0,
            'status' => $data['status'],
            'issued_at' => $data['issued_at'] ?? $bill->issued_at,
            'due_at' => $data['due_at'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        $bill->items()->delete();

        foreach ($data['items'] as $item) {
            BillItem::create([
                'bill_id' => $bill->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price'],
            ]);
        }

        $bill->recalculateTotals();

        return redirect()->route('bills.show', $bill)->with('success', 'Bill updated successfully.');
    }

    public function destroy(Bill $bill): RedirectResponse
    {
        $bill->delete();

        return redirect()->route('bills.index')->with('success', 'Bill deleted successfully.');
    }
}
