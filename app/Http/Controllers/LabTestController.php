<?php

namespace App\Http\Controllers;

use App\Models\LabTest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LabTestController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        $labTests = LabTest::query()
            ->when($search->isNotEmpty(), function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%")
                        ->orWhere('category', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('LabTests/Index', [
            'labTests' => $labTests,
            'filters' => ['search' => $search->toString()],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('LabTests/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:lab_tests,code'],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'normal_range' => ['nullable', 'string', 'max:255'],
            'unit' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        LabTest::create($data);

        return redirect()->route('lab-tests.index')->with('success', 'Lab test catalog entry created.');
    }

    public function edit(LabTest $labTest): Response
    {
        return Inertia::render('LabTests/Edit', [
            'labTest' => $labTest,
        ]);
    }

    public function update(Request $request, LabTest $labTest): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:lab_tests,code,'.$labTest->id],
            'category' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'normal_range' => ['nullable', 'string', 'max:255'],
            'unit' => ['nullable', 'string', 'max:50'],
            'is_active' => ['boolean'],
        ]);

        $labTest->update($data);

        return redirect()->route('lab-tests.index')->with('success', 'Lab test updated successfully.');
    }

    public function destroy(LabTest $labTest): RedirectResponse
    {
        $labTest->delete();

        return redirect()->route('lab-tests.index')->with('success', 'Lab test removed from catalog.');
    }
}
