<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\MedicalProduit;
use App\Models\Hopital;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StockCentalController extends Controller
{
    public function index()
{
    $stocks = Stock::whereNull('hopital_id')
        ->join('medical_produits', 'stocks.medical_produit_id', '=', 'medical_produits.id')
        ->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
        ->orderBy('medical_produits.name') // tri par nom du produit
        ->select('stocks.*') // important pour que Laravel retourne des objets Stock
        ->get();

    return Inertia::render('StocksCentral/Index', [
        'stocks' => $stocks,
        'produits' => MedicalProduit::orderBy('name')->get(),
        'hopitals' => Hopital::all(),
    ]);
}

    public function create()
    {
        return Inertia::render('StocksCentral/Create', [
            'produits' => MedicalProduit::orderBy('name')->get(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function store(Request $request)
{
    $request->validate([
        'medical_produit_id' => 'required|exists:medical_produits,id',
        'quantite' => 'required|integer|min:1',
        'status' => 'required|in:disponible,reservee,expirer,endommage',
        'received_date' => 'required|date',
    ]);

    Stock::create([
        'ref' => Str::uuid(),
        'medical_produit_id' => $request->medical_produit_id,
        'quantite' => $request->quantite,
        'numero_lot' => $request->numero_lot,
        'date_expiration' => $request->date_expiration ? Carbon::parse($request->date_expiration)->format('Y-m-d') : null,
        'prix_unitaire' => $request->prix_unitaire,
        'received_date' => Carbon::parse($request->received_date)->format('Y-m-d'),
        'status' => $request->status,
        'created_by' => auth()->id(),
    ]);
    return redirect()->route('central-stocks.index');
}

    public function show(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        return Inertia::render('StocksCentral/Show', [
            'stock' => $stock->load(['medical_produit', 'hopital', 'created_by', 'updated_by']),
            'produits' => MedicalProduit::orderBy('name')->get(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function edit(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        return Inertia::render('StocksCentral/Edit', [
            'stock' => $stock,
            'produits' => MedicalProduit::orderBy('name')->get(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function update(Request $request, string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        $request->validate([
            'medical_produit_id' => 'required|exists:medical_produits,id',
            'quantite' => 'required|integer|min:1',
            'status' => 'required|in:disponible,reservee,expirer,endommage',
            'received_date' => 'required|date',
        ]);

        
        $stock->update([
            'medical_produit_id' => $request->medical_produit_id,
            'quantite' => $request->quantite,
            'numero_lot' => $request->numero_lot,
            'prix_unitaire' => $request->prix_unitaire,
            'date_expiration' => $request->date_expiration ? Carbon::parse($request->date_expiration)->format('Y-m-d') : null,
            'received_date' => Carbon::parse($request->received_date)->format('Y-m-d'),
            'status' => $request->status,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('central-stocks.index');
    }

    public function destroy(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        $stock->delete();
        return redirect()->route('central-stocks.index');
    }
}
