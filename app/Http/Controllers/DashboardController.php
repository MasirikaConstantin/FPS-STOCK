<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Hopital;
use App\Models\Stock;
use App\Models\Transfert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
            'recentActivities' => $this->recentActivity(),
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
    public function recentActivity()
    {
        $user = Auth::user();
        $hospital_id = $user->profile->hopital_id;
        if($user->isAdminCentral()){
            $recentTransfers = Transfert::with(['fromHospital', 'toHospital'])
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($transfer) {
            return [
                'type' => 'transfert',
                'title' => $transfer->from_hospital_id ? 'Expédition vers' : 'Commande centrale',
                'hospital' => $transfer->toHospital->nom ?? null,
                'createdAt' => $transfer->created_at,
                'status' => $transfer->status,
            ];
        });

        // Récupération des alertes de stock
    $stockAlerts = Stock::whereHas('medicalProduit', function($query) {
        $query->whereColumn('stocks.quantite', '<=', 'medical_produits.seuil_min');
    })
    ->with(['medicalProduit', 'hopital'])
    ->orderBy('created_at', 'desc')
    ->limit(5)
    ->get()
    ->map(function ($stock) {
        return [
            'type' => 'alerte',
            'title' => 'Stock critique',
            'product' => $stock->medicalProduit->name,
            'hospital' => $stock->hopital->nom ?? 'Entrepôt central',
            'createdAt' => $stock->created_at,
        ];
    });

    // Récupération des réceptions récentes
    $recentReceptions = Transfert::where('status', 'livre')
        ->with(['toHospital'])
        ->orderBy('livre_le', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($transfer) {
            return [
                'type' => 'reception',
                'title' => 'Réception confirmée',
                'hospital' => $transfer->toHospital->nom,
                'createdAt' => $transfer->livre_le,
            ];
        });

        $entreStock = Stock::where('created_at', '>', now()->subDays(7))->get()->map(function ($stock) {
            return [
                'type' => 'entre_stock',
                'title' => 'Stock entré',
                'product' => $stock->medicalProduit->name,
                'hospital' => $stock->hopital->nom ?? 'Entrepôt central',
                'createdAt' => $stock->created_at,
            ];
        });

        }elseif($user->isAdmin() || $user->isMedicalStaff()){

            $recentTransfers = Transfert::where('from_hospital_id', $hospital_id)
            ->orWhere('to_hospital_id', $hospital_id)->with(['fromHospital', 'toHospital'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transfer) {
                return [
                    'type' => 'transfert',
                    'title' => $transfer->from_hospital_id ? 'Expédition vers' : 'Commande centrale',
                    'hospital' => $transfer->toHospital->nom ?? null,
                    'createdAt' => $transfer->created_at,
                    'status' => $transfer->status,
                ];
            });


            // Récupération des alertes de stock
        $stockAlerts = Stock::where('hopital_id', $hospital_id)->whereHas('medicalProduit', function($query) {
            $query->whereColumn('stocks.quantite', '<=', 'medical_produits.seuil_min');
        })
        ->with(['medicalProduit', 'hopital'])
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get()
        ->map(function ($stock) {
            return [
                'type' => 'alerte',
                'title' => 'Stock critique',
                'product' => $stock->medicalProduit->name,
                'hospital' => $stock->hopital->nom ?? 'Entrepôt central',
                'createdAt' => $stock->created_at,
            ];
        });
        $entreStock = Stock::where('hopital_id', $hospital_id)->where('created_at', '>', now()->subDays(7))->get()->map(function ($stock) {
            return [
                'type' => 'entre_stock',
                'title' => 'Stock entré',
                'product' => $stock->medicalProduit->name,
                'hospital' => $stock->hopital->nom ?? 'Entrepôt central',
                'createdAt' => $stock->created_at,
            ];
        });
        // Récupération des réceptions récentes
        $recentReceptions = Transfert::where('status', 'livre')
            ->with(['toHospital'])
            ->orderBy('livre_le', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transfer) {
                return [
                    'type' => 'reception',
                    'title' => 'Réception confirmée',
                    'hospital' => $transfer->toHospital->nom,
                    'createdAt' => $transfer->livre_le,
                ];
            });

        }
        

    
    // Fusion et tri des activités
    $recentActivities = collect()
        ->merge($recentTransfers)
        ->merge($stockAlerts)
        ->merge($recentReceptions)
        ->merge($entreStock)
        ->sortByDesc('createdAt')
        ->take(5)
        ->values()
        ->all();
        return $recentActivities;
    }
}
