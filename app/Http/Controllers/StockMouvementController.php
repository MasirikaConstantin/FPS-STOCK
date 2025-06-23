<?php

namespace App\Http\Controllers;

use App\Models\StockMouvement;
use App\Models\MedicalProduit;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StockMouvementController extends Controller
{
    // Affiche le formulaire de sortie directe
    public function createDirectOut()
    {
        return Inertia::render('Stock/DirectOut', [
            'products' => MedicalProduit::with(['stocks' => function($query) {
                $query->where('quantite', '>', 0)
                      ->with('hopital')
                      ->orderBy('date_expiration');
            }])->get()
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
        return Inertia::render('Stock/Mouvements', [
            'mouvements' => StockMouvement::with(['medicalProduit', 'hopital', 'createdBy'])
                ->orderBy('created_at', 'desc')
                ->paginate(20)
        ]);
    }
}