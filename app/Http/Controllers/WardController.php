<?php

namespace App\Http\Controllers;

use App\Models\Ward;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WardController extends Controller
{
    public function index(): Response
    {
        $wards = Ward::withCount('admissions')->orderBy('name')->paginate(10);

        return Inertia::render('Wards/Index', [
            'wards' => $wards,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Wards/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:wards,name'],
            'type' => ['required', 'string', 'max:100'],
            'capacity' => ['required', 'integer', 'min:1'],
            'floor' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        Ward::create([
            ...$data,
            'occupied_beds' => 0,
        ]);

        return redirect()->route('wards.index')->with('success', 'Ward created successfully.');
    }

    public function edit(Ward $ward): Response
    {
        return Inertia::render('Wards/Edit', [
            'ward' => $ward,
        ]);
    }

    public function update(Request $request, Ward $ward): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:wards,name,'.$ward->id],
            'type' => ['required', 'string', 'max:100'],
            'capacity' => ['required', 'integer', 'min:1'],
            'floor' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $ward->update($data);

        return redirect()->route('wards.index')->with('success', 'Ward updated successfully.');
    }

    public function destroy(Ward $ward): RedirectResponse
    {
        $ward->delete();

        return redirect()->route('wards.index')->with('success', 'Ward deleted successfully.');
    }
}
