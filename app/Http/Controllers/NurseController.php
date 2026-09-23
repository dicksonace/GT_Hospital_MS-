<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Department;
use App\Models\Nurse;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class NurseController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        $nurses = Nurse::with(['user', 'department'])
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('license_number', 'like', "%{$search}%")
                        ->orWhere('shift', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($u) => $u->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Nurses/Index', [
            'nurses' => $nurses,
            'filters' => ['search' => $search->toString()],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Nurses/Create', [
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'shifts' => $this->shifts(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'phone' => ['nullable', 'string', 'max:20'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'license_number' => ['required', 'string', 'max:50', 'unique:nurses,license_number'],
            'shift' => ['nullable', 'string', 'max:50'],
            'is_available' => ['boolean'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => UserRole::Nurse,
            'phone' => $data['phone'] ?? null,
        ]);

        Nurse::create([
            'user_id' => $user->id,
            'department_id' => $data['department_id'] ?? null,
            'license_number' => $data['license_number'],
            'phone' => $data['phone'] ?? null,
            'shift' => $data['shift'] ?? null,
            'is_available' => $data['is_available'] ?? true,
        ]);

        return redirect()->route('nurses.index')->with('success', 'Nurse account created. They can now sign in with their own login.');
    }

    public function show(Nurse $nurse): Response
    {
        $nurse->load([
            'user',
            'department',
            'notes' => fn ($q) => $q->with('patient')->latest('recorded_at')->limit(15),
        ]);

        return Inertia::render('Nurses/Show', [
            'nurse' => $nurse,
        ]);
    }

    public function edit(Nurse $nurse): Response
    {
        $nurse->load('user');

        return Inertia::render('Nurses/Edit', [
            'nurse' => $nurse,
            'departments' => Department::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'shifts' => $this->shifts(),
        ]);
    }

    public function update(Request $request, Nurse $nurse): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($nurse->user_id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'license_number' => ['required', 'string', 'max:50', Rule::unique('nurses', 'license_number')->ignore($nurse->id)],
            'shift' => ['nullable', 'string', 'max:50'],
            'is_available' => ['boolean'],
        ]);

        $nurse->user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
        ]);

        $nurse->update([
            'department_id' => $data['department_id'] ?? null,
            'license_number' => $data['license_number'],
            'phone' => $data['phone'] ?? null,
            'shift' => $data['shift'] ?? null,
            'is_available' => $data['is_available'] ?? false,
        ]);

        return redirect()->route('nurses.show', $nurse)->with('success', 'Nurse updated successfully.');
    }

    public function destroy(Nurse $nurse): RedirectResponse
    {
        $user = $nurse->user;
        $nurse->delete();
        $user?->delete();

        return redirect()->route('nurses.index')->with('success', 'Nurse removed and their login was deleted.');
    }

    /** @return list<array{value: string, label: string}> */
    private function shifts(): array
    {
        return [
            ['value' => 'morning', 'label' => 'Morning'],
            ['value' => 'afternoon', 'label' => 'Afternoon'],
            ['value' => 'night', 'label' => 'Night'],
            ['value' => 'rotating', 'label' => 'Rotating'],
        ];
    }
}
