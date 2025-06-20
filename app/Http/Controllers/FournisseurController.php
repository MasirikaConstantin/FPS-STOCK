<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FournisseurController extends Controller
{
    public function index()
    {
        $fournisseurs = Fournisseur::with(['creator', 'updater'])
            ->latest()
            ->get();
        return Inertia::render('Fournisseurs/Index', [
            'fournisseurs' => $fournisseurs,
        ]);
    }

    public function create()
    {
        return Inertia::render('Fournisseurs/Create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255',
        'contact_person' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'email' => 'nullable|email|max:255',
        'address' => 'nullable|string',
        'specialties' => 'nullable|array',
        'specialties.*' => 'string', // Validation de chaque élément du tableau
        'is_active' => 'boolean',
        'contract_start_date' => 'nullable|date',
        'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
    ]);

    Fournisseur::create([
        ...$validated,
        'created_by' => auth()->id()
    ]);

    return redirect()->route('fournisseurs.index')->with('success', 'Fournisseur créé avec succès');
}

    public function show(string $fournisseur)
    {
        $fournisseur = Fournisseur::where('ref', $fournisseur)->first();
        $fournisseur->load(['creator', 'updater']);

        return Inertia::render('Fournisseurs/Show', [
            'fournisseur' => $fournisseur,
        ]);
    }

    public function edit(string $fournisseur)
    {
        $fournisseur = Fournisseur::where('ref', $fournisseur)->first();
        return Inertia::render('Fournisseurs/Edit', [
            'fournisseur' => $fournisseur,
        ]);
    }

    public function update(Request $request, string $fournisseur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'specialties' => 'nullable|array',
            'is_active' => 'boolean',
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date|after_or_equal:contract_start_date',
        ]);

        $validated['updated_by'] = auth()->id();

        $fournisseur = Fournisseur::where('ref', $fournisseur)->first();
        $fournisseur->update($validated);

        return redirect()->route('fournisseurs.index')->with('success', 'Fournisseur mis à jour avec succès');
    }

    public function destroy(string $fournisseur)
    {
        $fournisseur = Fournisseur::where('ref', $fournisseur)->first();
        $fournisseur->delete();

        return redirect()->route('fournisseurs.index')->with('success', 'Fournisseur supprimé avec succès');
    }
}