<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Hopital;
use App\Models\StockMouvement;
use Illuminate\Support\Facades\DB;

class HospitalStatsController extends Controller
{
    public function show(Hopital $hopital)
    {
        // Stock movements data
        $movements = StockMouvement::where('hopital_id', $hopital->id)
            ->select([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN type = "entree" THEN quantite ELSE 0 END) as entree'),
                DB::raw('SUM(CASE WHEN type = "sortie" THEN quantite ELSE 0 END) as sortie'),
                DB::raw('SUM(CASE WHEN type = "transfert" THEN quantite ELSE 0 END) as transfert'),
                DB::raw('COUNT(*) as total')
            ])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Product distribution
        $productDistribution = DB::table('stocks')
            ->join('medical_produits', 'stocks.medical_produit_id', '=', 'medical_produits.id')
            ->select([
                'medical_produits.categorie_id',
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(quantite) as total_quantity')
            ])
            ->where('stocks.hopital_id', $hopital->id)
            ->groupBy('medical_produits.categorie_id')
            ->get();

        // Alert statistics
        $alerts = DB::table('alerts')
            ->select([
                'type',
                DB::raw('COUNT(*) as count')
            ])
            ->where('hopital_id', $hopital->id)
            ->where('is_resolved', false)
            ->groupBy('type')
            ->get();

        return Inertia::render('Hospital/Stats', [
            'hospital' => $hopital,
            'movements' => $movements,
            'productDistribution' => $productDistribution,
            'alerts' => $alerts,
            // Add more data as needed
        ]);
    }
}