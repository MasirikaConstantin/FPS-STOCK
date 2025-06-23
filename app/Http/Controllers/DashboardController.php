<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Hopital;
use App\Models\Stock;
use App\Models\Transfert;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $hopitaux_connectes = Hopital::where('is_active', true)->count();
        $stocks_total = Stock::all();
        $stocks_total = $stocks_total->sum('quantite');
        $alertes_avertissement_expiration = Alert::where('type', 'avertissement_expiration')->count();
        $transferts_en_attente = Transfert::where('status', 'en_attente')->orWhere('status', 'en_transit')->count();
        return Inertia::render('dashboard', [
            'hopitaux_connectes' => $hopitaux_connectes,
            'stocks_total' => $stocks_total,
            'alertes_avertissement_expiration' => $alertes_avertissement_expiration,
            'transferts_en_attente' => $transferts_en_attente,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
