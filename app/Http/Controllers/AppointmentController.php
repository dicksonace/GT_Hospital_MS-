<?php

namespace App\Http\Controllers;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Models\Appointment;
use App\Models\Department;
use App\Models\Doctor;
use App\Models\Patient;
use App\Notifications\PatientAssignedNotification;
use App\Support\NumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();
        $date = $request->string('date')->trim();

        $appointments = Appointment::with(['patient', 'doctor.user', 'department'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('appointment_number', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->when($status->isNotEmpty(), fn ($q) => $q->where('status', $status->toString()))
            ->when($date->isNotEmpty(), fn ($q) => $q->whereDate('appointment_date', $date->toString()))
            ->orderByDesc('appointment_date')
            ->orderByDesc('appointment_time')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Appointments/Index', [
            'appointments' => $appointments,
            'filters' => [
                'search' => $search->toString(),
                'status' => $status->toString(),
                'date' => $date->toString(),
            ],
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(AppointmentType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Appointments/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->where('is_available', true)->get(),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(AppointmentType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'type' => ['required', 'in:'.implode(',', array_column(AppointmentType::cases(), 'value'))],
            'status' => ['required', 'in:'.implode(',', array_column(AppointmentStatus::cases(), 'value'))],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $prefix = ($data['type'] ?? '') === AppointmentType::Checkup->value ? 'CHK' : 'APT';
        $data['appointment_number'] = NumberGenerator::next($prefix, Appointment::class, 'appointment_number');

        $appointment = Appointment::create($data);
        $this->notifyDoctor($appointment, $data['type'] === AppointmentType::Checkup->value ? 'checkup' : 'appointment');

        return redirect()->route('appointments.index')->with('success', 'Appointment scheduled and the doctor was notified by email.');
    }

    public function show(Appointment $appointment): Response
    {
        $appointment->load(['patient', 'doctor.user', 'department', 'medicalRecord', 'bill.items']);

        return Inertia::render('Appointments/Show', [
            'appointment' => $appointment,
        ]);
    }

    public function edit(Appointment $appointment): Response
    {
        $appointment->load(['patient', 'doctor.user', 'department']);

        return Inertia::render('Appointments/Edit', [
            'appointment' => $appointment,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
            'types' => collect(AppointmentType::cases())->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()]),
        ]);
    }

    public function update(Request $request, Appointment $appointment): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'type' => ['required', 'in:'.implode(',', array_column(AppointmentType::cases(), 'value'))],
            'status' => ['required', 'in:'.implode(',', array_column(AppointmentStatus::cases(), 'value'))],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $previousDoctorId = $appointment->doctor_id;
        $appointment->update($data);

        if ((int) $previousDoctorId !== (int) $appointment->doctor_id) {
            $this->notifyDoctor($appointment->fresh(['patient', 'doctor.user']), 'appointment');
        }

        return redirect()->route('appointments.show', $appointment)->with('success', 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment): RedirectResponse
    {
        $appointment->delete();

        return redirect()->route('appointments.index')->with('success', 'Appointment cancelled successfully.');
    }

    private function notifyDoctor(Appointment $appointment, string $assignmentType): void
    {
        $appointment->loadMissing(['patient', 'doctor.user']);

        if (! $appointment->doctor || ! $appointment->patient) {
            return;
        }

        $when = trim(($appointment->appointment_date?->toDateString() ?? '').' '.substr((string) $appointment->appointment_time, 0, 5));

        PatientAssignedNotification::notifyDoctor(
            $appointment->doctor,
            $appointment->patient,
            $assignmentType,
            $appointment->appointment_number,
            $when,
            $appointment->reason,
        );
    }
}
