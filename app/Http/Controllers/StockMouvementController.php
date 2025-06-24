<?php

namespace App\Http\Controllers;

use App\Models\StockMouvement;
use App\Models\MedicalProduit;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockMouvementController extends Controller
{
    // Affiche le formulaire de sortie directe
    public function createDirectOut()
{
    $user = Auth::user();
    $produits = new MedicalProduit();
    
    if($user->isAdminCentral()){
        $produits = MedicalProduit::with(['stocks' => function($query) {
            $query->whereNull("hopital_id") // <-- Seulement les stocks centraux (hopital_id = NULL)
                  ->with('hopital') // (Optionnel : si hopital_id est NULL, cette relation sera vide)
                  ->orderBy('date_expiration');
        }])->orderBy('name')->get();
    }elseif($user->isAdmin() || $user->isMedicalStaff()){
        $produits = MedicalProduit::with(['stocks' => function($query) use ($user) {
            $query->where("hopital_id", $user->profile->hopital_id)
                  ->with('hopital')
                  ->orderBy('date_expiration');
        }])->orderBy('name')->get();
    }
    
    return Inertia::render('Stock/DirectOut', [
        'products' => $produits 
    ]);
}

    // Traite la sortie directe
    public function storeDirectOut(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:medical_produits,id',
            'allocations' => 'required|array',
            'allocations.*.stock_id' => 'required|exists:stocks,id',
            'allocations.*.quantity' => 'required|integer|min:1',
            'raison' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $total = 0;
            
            // Vérifier d'abord que les stocks sont suffisants
            foreach ($validated['allocations'] as $allocation) {
                $stock = Stock::find($allocation['stock_id']);
                if ($stock->quantite < $allocation['quantity']) {
                    throw new \Exception("Stock insuffisant pour le lot {$stock->numero_lot}");
                }
                $total += $allocation['quantity'];
            }

            // Enregistrer les mouvements
            foreach ($validated['allocations'] as $allocation) {
                $stock = Stock::find($allocation['stock_id']);
                
                StockMouvement::create([
                    'type' => 'sortie',
                    'quantite' => $allocation['quantity'],
                    'medical_produit_id' => $validated['product_id'],
                    'hopital_id' => $stock->hopital_id,
                    'raison' => $validated['raison'],
                    'notes' => $validated['notes'],
                    'ref' => Str::uuid(),
                    'created_by' => auth()->id(),
                    'updated_by' => auth()->id(),
                ]);

                $stock->quantite -= $allocation['quantity'];
                $stock->save();
            }

            DB::commit();

            return redirect()->route('stock.mouvements.index')
                ->with('success', "Sortie de $total produits enregistrée");
                
        } catch (\Exception $e) {
            dd($e->getMessage());
            DB::rollBack();
            return back()->with('error', $e->getMessage());
        }
    }

    // Liste des mouvements
    public function index()
    {
        $user = Auth::user();
        $mouvements = new StockMouvement();
        if($user->isAdminCentral()){
            $mouvements = StockMouvement::with(['medicalProduit', 'hopital', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        }elseif($user->isAdmin() || $user->isMedicalStaff()){
            $mouvements = StockMouvement::where('hopital_id', $user->profile->hopital_id)->with(['medicalProduit', 'hopital', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        }
        return Inertia::render('Stock/Mouvements', [
            'mouvements' => $mouvements
        ]);
    }
}