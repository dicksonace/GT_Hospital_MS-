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

class CheckupController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();
        $date = $request->string('date')->trim();

        $checkups = Appointment::with(['patient', 'doctor.user', 'department'])
            ->where('type', AppointmentType::Checkup)
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

        return Inertia::render('Checkups/Index', [
            'checkups' => $checkups,
            'filters' => [
                'search' => $search->toString(),
                'status' => $status->toString(),
                'date' => $date->toString(),
            ],
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Checkups/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->where('is_available', true)->get(),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['type'] = AppointmentType::Checkup->value;
        $data['appointment_number'] = NumberGenerator::next('CHK', Appointment::class, 'appointment_number');

        $checkup = Appointment::create($data);
        $this->notifyDoctor($checkup);

        return redirect()->route('checkups.show', $checkup)->with('success', 'Checkup booked and the doctor was notified by email.');
    }

    public function show(Appointment $checkup): Response
    {
        $this->ensureCheckup($checkup);
        $checkup->load(['patient', 'doctor.user', 'department', 'medicalRecord', 'bill.items']);

        return Inertia::render('Checkups/Show', [
            'checkup' => $checkup,
        ]);
    }

    public function edit(Appointment $checkup): Response
    {
        $this->ensureCheckup($checkup);
        $checkup->load(['patient', 'doctor.user', 'department']);

        return Inertia::render('Checkups/Edit', [
            'checkup' => $checkup,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'statuses' => collect(AppointmentStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function update(Request $request, Appointment $checkup): RedirectResponse
    {
        $this->ensureCheckup($checkup);

        $previousDoctorId = $checkup->doctor_id;
        $data = $this->validated($request);
        $data['type'] = AppointmentType::Checkup->value;

        $checkup->update($data);

        if ((int) $previousDoctorId !== (int) $checkup->doctor_id) {
            $this->notifyDoctor($checkup->fresh(['patient', 'doctor.user']));
        }

        return redirect()->route('checkups.show', $checkup)->with('success', 'Checkup updated successfully.');
    }

    public function destroy(Appointment $checkup): RedirectResponse
    {
        $this->ensureCheckup($checkup);
        $checkup->delete();

        return redirect()->route('checkups.index')->with('success', 'Checkup cancelled.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'department_id' => ['required', 'exists:departments,id'],
            'appointment_date' => ['required', 'date'],
            'appointment_time' => ['required', 'date_format:H:i'],
            'status' => ['required', 'in:'.implode(',', array_column(AppointmentStatus::cases(), 'value'))],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);
    }

    private function ensureCheckup(Appointment $appointment): void
    {
        if ($appointment->type !== AppointmentType::Checkup) {
            abort(404);
        }
    }

    private function notifyDoctor(Appointment $checkup): void
    {
        $checkup->loadMissing(['patient', 'doctor.user']);

        if (! $checkup->doctor || ! $checkup->patient) {
            return;
        }

        $when = trim(($checkup->appointment_date?->toDateString() ?? '').' '.substr((string) $checkup->appointment_time, 0, 5));

        PatientAssignedNotification::notifyDoctor(
            $checkup->doctor,
            $checkup->patient,
            'checkup',
            $checkup->appointment_number,
            $when,
            $checkup->reason,
        );
    }
}
