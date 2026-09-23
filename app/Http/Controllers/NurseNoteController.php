<?php

namespace App\Http\Controllers;

use App\Enums\NurseNoteType;
use App\Enums\UserRole;
use App\Models\Doctor;
use App\Models\Nurse;
use App\Models\NurseNote;
use App\Models\Patient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NurseNoteController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();
        $user = $request->user();

        $notes = NurseNote::with(['patient', 'nurse.user', 'doctor.user'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->whereHas('patient', fn ($p) => $p->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('patient_number', 'like', "%{$search}%"));
            })
            ->when($user->hasRole(UserRole::Doctor) && $user->doctor, function ($query) use ($user) {
                $query->where(function ($q) use ($user) {
                    $q->where('doctor_id', $user->doctor->id)
                        ->orWhereHas('patient.appointments', fn ($a) => $a->where('doctor_id', $user->doctor->id))
                        ->orWhereHas('patient.admissions', fn ($a) => $a->where('doctor_id', $user->doctor->id));
                });
            })
            ->latest('recorded_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('NurseNotes/Index', [
            'notes' => $notes,
            'filters' => ['search' => $search->toString()],
            'canWrite' => $this->canWrite($request),
        ]);
    }

    public function create(Request $request): Response
    {
        $this->authorizeWrite($request);

        return Inertia::render('NurseNotes/Create', [
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->where('is_available', true)->get(),
            'types' => $this->types(),
            'selectedPatient' => $request->integer('patient_id') ?: null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorizeWrite($request);

        $nurse = $this->currentNurse($request);
        $data = $this->validated($request);

        NurseNote::create([
            ...$data,
            'nurse_id' => $nurse->id,
            'recorded_at' => now(),
        ]);

        return redirect()->route('nurse-notes.index')->with('success', 'Nurse note recorded. Assigned doctors can review it.');
    }

    public function show(Request $request, NurseNote $nurseNote): Response
    {
        $this->authorizeView($request, $nurseNote);

        $nurseNote->load(['patient', 'nurse.user', 'doctor.user']);

        return Inertia::render('NurseNotes/Show', [
            'note' => $nurseNote,
            'canWrite' => $this->ownsNote($request, $nurseNote) || $request->user()->isAdmin(),
        ]);
    }

    public function edit(Request $request, NurseNote $nurseNote): Response
    {
        $this->authorizeEdit($request, $nurseNote);

        $nurseNote->load(['patient', 'nurse.user']);

        return Inertia::render('NurseNotes/Edit', [
            'note' => $nurseNote,
            'patients' => Patient::orderBy('first_name')->get(['id', 'first_name', 'last_name', 'patient_number']),
            'doctors' => Doctor::with('user')->get(),
            'types' => $this->types(),
        ]);
    }

    public function update(Request $request, NurseNote $nurseNote): RedirectResponse
    {
        $this->authorizeEdit($request, $nurseNote);

        $nurseNote->update($this->validated($request));

        return redirect()->route('nurse-notes.show', $nurseNote)->with('success', 'Nurse note updated.');
    }

    public function destroy(Request $request, NurseNote $nurseNote): RedirectResponse
    {
        $this->authorizeEdit($request, $nurseNote);

        $nurseNote->delete();

        return redirect()->route('nurse-notes.index')->with('success', 'Nurse note deleted.');
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        return $request->validate([
            'patient_id' => ['required', 'exists:patients,id'],
            'doctor_id' => ['nullable', 'exists:doctors,id'],
            'note_type' => ['required', 'in:'.implode(',', NurseNoteType::values())],
            'blood_pressure' => ['nullable', 'string', 'max:20'],
            'temperature' => ['nullable', 'numeric', 'between:30,45'],
            'pulse' => ['nullable', 'integer', 'between:20,250'],
            'respiratory_rate' => ['nullable', 'integer', 'between:5,80'],
            'oxygen_saturation' => ['nullable', 'integer', 'between:50,100'],
            'notes' => ['required', 'string'],
        ]);
    }

    private function currentNurse(Request $request): Nurse
    {
        $nurse = $request->user()->nurse;

        if (! $nurse) {
            abort(403, 'Your account is not linked to a nurse profile. Ask an administrator to create one.');
        }

        return $nurse;
    }

    private function canWrite(Request $request): bool
    {
        $user = $request->user();

        return $user->isAdmin() || ($user->hasRole(UserRole::Nurse) && (bool) $user->nurse);
    }

    private function ownsNote(Request $request, NurseNote $note): bool
    {
        return $request->user()->nurse?->id === $note->nurse_id;
    }

    private function authorizeWrite(Request $request): void
    {
        if (! $this->canWrite($request)) {
            abort(403, 'Only nurses can record nursing notes.');
        }
    }

    private function authorizeEdit(Request $request, NurseNote $note): void
    {
        if ($request->user()->isAdmin() || $this->ownsNote($request, $note)) {
            return;
        }

        abort(403, 'You can only edit your own nursing notes.');
    }

    private function authorizeView(Request $request, NurseNote $note): void
    {
        $user = $request->user();

        if ($user->isAdmin() || $user->hasRole(UserRole::Nurse) || $this->ownsNote($request, $note)) {
            return;
        }

        if ($user->hasRole(UserRole::Doctor) && $user->doctor) {
            $assigned = (int) $note->doctor_id === (int) $user->doctor->id
                || $note->patient?->appointments()->where('doctor_id', $user->doctor->id)->exists()
                || $note->patient?->admissions()->where('doctor_id', $user->doctor->id)->exists();

            if ($assigned) {
                return;
            }
        }

        abort(403, 'You do not have access to this nursing note.');
    }

    /** @return list<array{value: string, label: string}> */
    private function types(): array
    {
        return collect(NurseNoteType::cases())
            ->map(fn ($t) => ['value' => $t->value, 'label' => $t->label()])
            ->all();
    }
}
