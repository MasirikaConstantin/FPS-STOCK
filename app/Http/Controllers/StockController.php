<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\MedicalProduit;
use App\Models\Hopital;
use App\Models\StockMouvement;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class StockController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->isAdminCentral()) {
            $stocks = Stock::with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        } elseif ($user->isAdmin() || $user->isMedicalStaff()) {
            $stocks = Stock::where('hopital_id', $user->profile->hopital_id)->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        }else{
            $stocks = Stock::where('created_by', $user->id)->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        }

        return Inertia::render('Stocks/Index', [
            'stocks' => $stocks,
            'produits' => MedicalProduit::all(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Stocks/Create', [
            'produits' => MedicalProduit::all(),
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
        'hopital_id' => $request->hopital_id,
        'created_by' => auth()->id(),
    ]);

    return redirect()->route('stocks.index');
}

    public function show(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        return Inertia::render('Stocks/Show', [
            'stock' => $stock->load(['medical_produit', 'hopital', 'created_by', 'updated_by']),
            'produits' => MedicalProduit::all(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function edit(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        return Inertia::render('Stocks/Edit', [
            'stock' => $stock,
            'produits' => MedicalProduit::all(),
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
            'hopital_id' => $request->hopital_id,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('stocks.index');
    }

    public function destroy(string $stock)
    {
        $stock = Stock::where('ref', $stock)->firstOrFail();
        $stock->delete();
        return redirect()->route('stocks.index');
    }
    public function lesstocks()
    {
        $user = Auth::user();

        if ($user->isAdminCentral()) {
            $stocks = Stock::with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        } elseif ($user->isAdmin()) {
            $stocks = Stock::where('hopital_id', $user->profile->hopital_id)->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        } elseif ($user->isMedicalStaff()) {
            $stocks = Stock::where('created_by', $user->id)->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        }else{
            $stocks = Stock::where('created_by', $user->id)->with(['medical_produit', 'hopital', 'created_by', 'updated_by'])
            ->orderBy('created_at', 'desc')
            ->get();
        }
        
        return Inertia::render('Stocks/LesSTocks', [
            'stocks' => $stocks,
            'produits' => MedicalProduit::all(),
            'hopitals' => Hopital::all(),
            'mouvements' => StockMouvement::with(['medicalProduit', 'hopital', 'createdBy'])
                ->orderBy('created_at', 'desc')
                ->paginate(20)
        ]);
    }
}