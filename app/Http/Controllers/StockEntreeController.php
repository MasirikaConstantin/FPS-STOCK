<?php

namespace App\Http\Controllers;

use App\Models\MedicalProduit;
use App\Models\Stock;
use App\Models\StockMouvement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockEntreeController extends Controller
{
    // Affiche le formulaire d'entrée
    public function create()
    {
        return Inertia::render('Stock/Entree', [
            'products' => MedicalProduit::orderBy('name')->get()
        ]);
    }

    // Enregistre l'entrée de stock
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medical_produit_id' => 'required|exists:medical_produits,id',
            'quantite' => 'required|integer|min:1',
            'numero_lot' => 'nullable|string|max:255',
            'date_expiration' => 'nullable|date|after_or_equal:today',
            'prix_unitaire' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        DB::beginTransaction();

        try {
            // Créer ou mettre à jour le stock au dépôt central (hopital_id null)
            $stock = Stock::updateOrCreate(
                [
                    'medical_produit_id' => $validated['medical_produit_id'],
                    'hopital_id' => null,
                    'numero_lot' => $validated['numero_lot']
                ],
                [
                    'quantite' => DB::raw('quantite + ' . $validated['quantite']),
                    'date_expiration' => $validated['date_expiration'],
                    'prix_unitaire' => $validated['prix_unitaire'],
                    'received_date' => now(),
                    'status' => 'disponible',
                    'ref' => Str::uuid(),
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]
            );


            StockMouvement::create([
                'type' => 'entree',
                'quantite' => $validated['quantite'],
                'medical_produit_id' => $validated['medical_produit_id'],
                'hopital_id' => null,
                'notes' => $validated['notes'],
                'ref' => Str::uuid(),
                'created_by' => auth()->id(),
                'updated_by' => auth()->id(),
            ]);

            DB::commit();

            return redirect()->route('stock.mouvements.index')
                ->with('success', 'Entrée de stock enregistrée avec succès');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de l\'enregistrement: ' . $e->getMessage());
        }
    }


    public function show(string $id)
{

    $stock = Stock::where('ref', $id)->with(['medicalProduit', 'createdBy', 'updatedBy'])
        ->whereNull('hopital_id')
        ->firstOrFail();

    return Inertia::render('Stock/Show', [
        'stock' => $stock,
        'mouvements' => StockMouvement::where('medical_produit_id', $stock->medical_produit_id)
            ->with(['createdBy', 'hopital'])
            ->orderBy('created_at', 'desc')
            ->get()
    ]);
}
}