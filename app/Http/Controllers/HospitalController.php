<?php

namespace App\Http\Controllers;

use App\Models\Hopital;
use App\Models\DivisionAdministrative;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\StockMouvement;
use Illuminate\Support\Facades\DB;

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

    $hopital = $hospital;

    // Données des mouvements avec gestion des valeurs nulles
    $movements = StockMouvement::where('hopital_id', $hopital->id)
        ->select('type', DB::raw('COUNT(*) as count'))
        ->groupBy('type')
        ->get()
        ->map(function($item) {
            return [
                'type' => $item->type ?? 'inconnu',
                'count' => (int)$item->count
            ];
        })
        ->toArray();

    // Répartition des produits
    $productDistribution = DB::table('stocks')
        ->join('medical_produits', 'stocks.medical_produit_id', '=', 'medical_produits.id')
        ->join('categories', 'medical_produits.categorie_id', '=', 'categories.id')
        ->select(
            'categories.nom as category',
            DB::raw('COUNT(*) as count')
        )
        ->where('stocks.hopital_id', $hopital->id)
        ->groupBy('categories.nom')
        ->get()
        ->map(function($item) {
            return [
                'category' => $item->category ?? 'Autre',
                'count' => (int)$item->count
            ];
        })
        ->toArray();

    // Alertes
    $alerts = DB::table('alerts')
        ->select('type', DB::raw('COUNT(*) as count'))
        ->where('hopital_id', $hopital->id)
        ->where('is_resolved', false)
        ->groupBy('type')
        ->get()
        ->map(function($item) {
            return [
                'type' => $item->type ?? 'inconnu',
                'count' => (int)$item->count
            ];
        })
        ->toArray();

    // Historique des transactions avec formatage de dates
    $transactionHistory = StockMouvement::where('hopital_id', $hopital->id)
        ->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantite) as amount')
        )
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function($item) {
            return [
                'date' => $item->date,
                'amount' => (int)$item->amount
            ];
        })
        ->toArray();

    // Données de stock sur les 30 derniers jours
    $stockData = DB::table('stocks')
        ->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(quantite) as quantity')
        )
        ->where('hopital_id', $hopital->id)
        ->whereDate('created_at', '>=', now()->subDays(30))
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function($item) {
            return [
                'date' => $item->date,
                'quantity' => (int)$item->quantity
            ];
        })
        ->toArray();

    return Inertia::render('Hospitals/Show', [
        'hopital' => $hospital,
        'hospital' => $hopital,
        'movements' => $movements,
        'productDistribution' => $productDistribution,
        'alerts' => $alerts,        
        'transactionHistory' => $transactionHistory,
        'stockData' => $stockData,
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