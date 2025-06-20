<?php

namespace App\Http\Controllers;

use App\Models\Hopital;
use App\Models\DivisionAdministrative;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function index()
    {
        $hospitals = Hopital::with(['divisionAdministrative', 'creator', 'updater'])
            ->latest()
            ->get();

        return Inertia::render('Hospitals/Index', [
            'hospitals' => $hospitals,
        ]);
    }

    public function create()
    {
        $divisions = DivisionAdministrative::all();
        $types = ['central', 'general', 'reference', 'centre_sante'];

        return Inertia::render('Hospitals/Create', [
            'divisions' => $divisions,
            'types' => $types,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'nullable|in:central,general,reference,centre_sante',
            'province' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'capacite' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'coordonees' => 'nullable|array',
            'division_administrative_id' => 'nullable|exists:division_administraves,id',
        ]);

        $validated['ref'] = \Illuminate\Support\Str::uuid();
        $validated['created_by'] = auth()->id();

        Hopital::create($validated);

        return redirect()->route('hopitals.index')->with('success', 'Hôpital créé avec succès');
    }

    public function show(string $hospital)
    {
        $hospital = Hopital::where('ref', $hospital)->firstOrFail();
        $hospital->load(['divisionAdministrative', 'creator', 'updater']);

        return Inertia::render('Hospitals/Show', [
            'hopital' => $hospital,
        ]);
    }

    public function edit(string $hopital)
    {
        $hopital = Hopital::where('ref', $hopital)->firstOrFail();
        $divisions = DivisionAdministrative::all();
        $types = ['central', 'general', 'reference', 'centre_sante'];

        return Inertia::render('Hospitals/Edit', [
            'hopital' => $hopital,
            'divisions' => $divisions,
            'types' => $types,
        ]);
    }

    public function update(Request $request, string $hospital)
    {
        $hospital = Hopital::where('ref', $hospital)->firstOrFail();
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'nullable|in:central,general,reference,centre_sante',
            'province' => 'required|string|max:255',
            'ville' => 'required|string|max:255',
            'address' => 'nullable|string',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'capacite' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'coordonees' => 'nullable|array',
            'division_administrative_id' => 'nullable|exists:division_administraves,id',
        ]);

        $validated['updated_by'] = auth()->id();

        $hospital->update($validated);

        return redirect()->route('hopitals.index')->with('success', 'Hôpital mis à jour avec succès');
    }

    public function destroy(string $hospital)
    {
        $hospital = Hopital::where('ref', $hospital)->firstOrFail();
        $hospital->delete();

        return redirect()->route('hopitals.index')->with('success', 'Hôpital supprimé avec succès');
    }
}