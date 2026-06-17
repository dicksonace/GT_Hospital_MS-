<?php

namespace App\Http\Controllers;

use App\Enums\AdmissionStatus;
use App\Models\Admission;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Ward;
use App\Support\NumberGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $status = $request->string('status')->trim();

        $admissions = Admission::with(['patient', 'doctor.user', 'ward'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('admission_number', 'like', "%{$search}%")
                        ->orWhereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%"));
                });
            })
            ->when($status->isNotEmpty(), fn ($q) => $q->where('status', $status->toString()))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admissions/Index', [
            'admissions' => $admissions,
            'filters' => ['search' => $search->toString(), 'status' => $status->toString()],
            'statuses' => collect(AdmissionStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admissions/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'wards' => Ward::where('is_active', true)->orderBy('name')->get(),
            'statuses' => collect(AdmissionStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'ward_id' => ['required', 'exists:wards,id'],
            'bed_number' => ['required', 'string', 'max:50'],
            'admission_date' => ['required', 'date'],
            'status' => ['required', 'in:'.implode(',', array_column(AdmissionStatus::cases(), 'value'))],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $ward = Ward::findOrFail($data['ward_id']);

        if ($ward->availableBeds() <= 0 && $data['status'] === AdmissionStatus::Admitted->value) {
            return back()->withErrors(['ward_id' => 'Selected ward has no available beds.']);
        }

        $admission = Admission::create([
            ...$data,
            'admission_number' => NumberGenerator::next('ADM', Admission::class, 'admission_number'),
        ]);

        if ($data['status'] === AdmissionStatus::Admitted->value) {
            $ward->increment('occupied_beds');
        }

        return redirect()->route('admissions.index')->with('success', 'Patient admitted successfully.');
    }

    public function show(Admission $admission): Response
    {
        $admission->load(['patient', 'doctor.user', 'ward']);

        return Inertia::render('Admissions/Show', [
            'admission' => $admission,
        ]);
    }

    public function edit(Admission $admission): Response
    {
        $admission->load(['patient', 'doctor.user', 'ward']);

        return Inertia::render('Admissions/Edit', [
            'admission' => $admission,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'wards' => Ward::where('is_active', true)->orderBy('name')->get(),
            'statuses' => collect(AdmissionStatus::cases())->map(fn ($s) => ['value' => $s->value, 'label' => $s->label()]),
        ]);
    }

    public function update(Request $request, Admission $admission): RedirectResponse
    {
        $data = $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['required', 'exists:doctors,id'],
            'ward_id' => ['required', 'exists:wards,id'],
            'bed_number' => ['required', 'string', 'max:50'],
            'admission_date' => ['required', 'date'],
            'discharge_date' => ['nullable', 'date'],
            'status' => ['required', 'in:'.implode(',', array_column(AdmissionStatus::cases(), 'value'))],
            'diagnosis' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $oldStatus = $admission->status;
        $oldWardId = $admission->ward_id;

        if ($oldStatus === AdmissionStatus::Admitted && $data['status'] !== AdmissionStatus::Admitted->value) {
            Ward::find($oldWardId)?->decrement('occupied_beds');
        } elseif ($oldStatus !== AdmissionStatus::Admitted && $data['status'] === AdmissionStatus::Admitted->value) {
            Ward::find($data['ward_id'])?->increment('occupied_beds');
        } elseif ($oldStatus === AdmissionStatus::Admitted && (int) $oldWardId !== (int) $data['ward_id']) {
            Ward::find($oldWardId)?->decrement('occupied_beds');
            Ward::find($data['ward_id'])?->increment('occupied_beds');
        }

        $admission->update($data);

        return redirect()->route('admissions.show', $admission)->with('success', 'Admission updated successfully.');
    }

    public function destroy(Admission $admission): RedirectResponse
    {
        if ($admission->status === AdmissionStatus::Admitted) {
            $admission->ward?->decrement('occupied_beds');
        }

        $admission->delete();

        return redirect()->route('admissions.index')->with('success', 'Admission record deleted.');
    }
}
