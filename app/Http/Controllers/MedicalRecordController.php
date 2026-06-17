<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalRecordController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        $records = MedicalRecord::with(['patient', 'doctor.user'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->whereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('patient_number', 'like', "%{$search}%"));
            })
            ->latest('visit_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MedicalRecords/Index', [
            'records' => $records,
            'filters' => ['search' => $search->toString()],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('MedicalRecords/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
            'selectedPatient' => $request->integer('patient_id') ?: null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'visit_date' => ['required', 'date'],
            'symptoms' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'prescription_notes' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        MedicalRecord::create($data);

        return redirect()->route('medical-records.index')->with('success', 'Medical record created successfully.');
    }

    public function show(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load(['patient', 'doctor.user', 'appointment']);

        return Inertia::render('MedicalRecords/Show', [
            'record' => $medicalRecord,
        ]);
    }

    public function edit(MedicalRecord $medicalRecord): Response
    {
        $medicalRecord->load(['patient', 'doctor.user']);

        return Inertia::render('MedicalRecords/Edit', [
            'record' => $medicalRecord,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'appointments' => Appointment::with('patient')->latest()->limit(50)->get(),
        ]);
    }

    public function update(Request $request, MedicalRecord $medicalRecord): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'appointment_id' => ['nullable', 'exists:appointments,id'],
            'visit_date' => ['required', 'date'],
            'symptoms' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'prescription_notes' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $medicalRecord->update($data);

        return redirect()->route('medical-records.show', $medicalRecord)->with('success', 'Medical record updated successfully.');
    }

    public function destroy(MedicalRecord $medicalRecord): RedirectResponse
    {
        $medicalRecord->delete();

        return redirect()->route('medical-records.index')->with('success', 'Medical record deleted successfully.');
    }
}
