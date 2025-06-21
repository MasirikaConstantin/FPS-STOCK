<?php

namespace App\Http\Controllers;

use App\Models\MedicalProduit;
use App\Models\Categorie;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class MedicalProduitController extends Controller
{
    public function index()
    {
        return Inertia::render('MedicalProduits/Index', [
            'produits' => MedicalProduit::with(['categorie', 'fournisseur', 'creator', 'updater'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'categories' => Categorie::all(),
            'fournisseurs' => Fournisseur::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('MedicalProduits/Create', [
            'categories' => Categorie::all(),
            'fournisseurs' => Fournisseur::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'unite' => 'required|string|max:50',
            'prix_unitaire' => 'required|numeric|min:0',
            'seuil_min' => 'required|integer|min:0',
            'duree_vie' => 'required|integer|min:1',
        ]);

        MedicalProduit::create([
            'ref' => Str::uuid(),
            'name' => $request->name,
            'categorie_id' => $request->categorie_id,
            'sous_category' => $request->sous_category,
            'unite' => $request->unite,
            'description' => $request->description,
            'fabrican' => $request->fabrican,
            'fournisseur_id' => $request->fournisseur_id ?: null,
            'requires_refrigeration' => $request->requires_refrigeration ?? false,
            'duree_vie' => $request->duree_vie,
            'seuil_min' => $request->seuil_min,
            'prix_unitaire' => $request->prix_unitaire,
            'is_active' => $request->is_active ?? true,
            'created_by' => auth()->id(),
        ]);

        return redirect()->route('medical-produits.index');
    }

    public function show(string $medicalProduit)
    {
        $medicalProduit = MedicalProduit::where('ref', $medicalProduit)
            ->with(['categorie', 'fournisseur', 'creator', 'updater'])
            ->firstOrFail();
        return Inertia::render('MedicalProduits/Show', [
            'produit' => $medicalProduit,
            'categories' => Categorie::all(),
            'fournisseurs' => Fournisseur::all(),
        ]);
    }

    public function edit(string $medicalProduit)
    {
        $medicalProduit = MedicalProduit::where('ref', $medicalProduit)
            ->with(['categorie', 'fournisseur', 'creator', 'updater'])
            ->firstOrFail();
        return Inertia::render('MedicalProduits/Edit', [
            'produit' => $medicalProduit,
            'categories' => Categorie::all(),
            'fournisseurs' => Fournisseur::all(),
        ]);
    }

    public function update(Request $request, MedicalProduit $medicalProduit)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'unite' => 'required|string|max:50',
            'prix_unitaire' => 'required|numeric|min:0',
            'seuil_min' => 'required|integer|min:0',
            'duree_vie' => 'required|integer|min:1',
        ]);

        $medicalProduit->update([
            'name' => $request->name,
            'categorie_id' => $request->categorie_id,
            'sous_category' => $request->sous_category,
            'unite' => $request->unite,
            'description' => $request->description,
            'fabrican' => $request->fabrican,
            'fournisseur_id' => $request->fournisseur_id ?: null,
            'requires_refrigeration' => $request->requires_refrigeration ?? false,
            'duree_vie' => $request->duree_vie,
            'seuil_min' => $request->seuil_min,
            'prix_unitaire' => $request->prix_unitaire,
            'is_active' => $request->is_active ?? true,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('medical-produits.index');
    }

    public function destroy(string $medicalProduit)
    {
        $medicalProduit = MedicalProduit::where('ref', $medicalProduit)->firstOrFail();
        $medicalProduit->delete();
        return redirect()->route('medical-produits.index');
    }
}