<?php

namespace App\Http\Controllers;

use App\Models\Transfert;
use App\Models\MedicalProduit;
use App\Models\Hopital;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TransfertController extends Controller
{
    public function index()
    {
        $transferts = Transfert::with(['fromHospital', 'toHospital', 'demandeur', 'items.medicalProduit'])
            ->latest()
            ->paginate(10);

        return inertia('Transferts/Index', [
            'transferts' => $transferts,
        ]);
    }

        public function create()
    {
        $hopitals = Hopital::all();
        $produits = MedicalProduit::with(['stocks' => function($query) {
            $query->with('hopital') // Charge la relation hopital
                ->where(function($q) {
                    $q->whereNull('hopital_id')
                    ->orWhereNotNull('hopital_id');
                });
        }])->get();

        return inertia('Transferts/Create', [
            'hopitals' => $hopitals,
            'produits' => $produits,
        ]);
    }

    public function store(Request $request)
    {

        try {
            $validated = $request->validate([
                'to_hospital_id' => ['nullable', 'exists:hopitals,id'],
                'to_central' => ['required', 'boolean'],
                'priorite' => ['required', 'in:faible,moyen,eleve,urgent'],
                'notes' => ['nullable', 'string'],
                'items' => ['required', 'array', 'min:1'],
                'items.*.medical_produit_id' => ['required', 'exists:medical_produits,id'],
                'items.*.quantite' => ['required', 'integer', 'min:1'],
                'items.*.from_central' => ['required', 'boolean'],
                'items.*.stock_source_id' => [
                    'nullable',
                    'exists:stocks,id',
                    Rule::requiredIf(function () use ($request) {
                        return !$request->input('items.*.from_central');
                    })
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            dd($e->validator->errors());
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Veuillez corriger les erreurs dans le formulaire');
        }

        DB::transaction(function () use ($validated, $request) {
            $transfert = Transfert::create([
                'from_hospital_id' => $request->input('from_hospital_id'),
                'to_hospital_id' => $validated['to_hospital_id'],
                'from_central' => $request->input('from_central', false),
                'to_central' => $validated['to_central'],
                'status' => 'en_attente',
                'priorite' => $validated['priorite'],
                'demandeur_id' => auth()->id(),
                'notes' => $validated['notes'],
                'ref' => \Illuminate\Support\Str::uuid(),
            ]);

            foreach ($validated['items'] as $item) {
                $transfert->items()->create([
                    'medical_produit_id' => $item['medical_produit_id'],
                    'stock_source_id' => $item['stock_source_id'],
                    'from_central' => $item['from_central'],
                    'quantite' => $item['quantite'],
                    'status' => 'en_attente',
                    'ref' => \Illuminate\Support\Str::uuid(),
                ]);

                // Réserver le stock
                if ($item['stock_source_id']) {
                    $stock = Stock::find($item['stock_source_id']);
                    $stock->decrement('quantite', $item['quantite']);
                }
            }
        });

        return redirect()->route('transferts.index')->with('success', 'Transfert créé avec succès');
    }

    public function show(Transfert $transfert)
    {
        $transfert->load([
            'fromHospital',
            'toHospital',
            'demandeur',
            'approbateur',
            'items.medicalProduit',
            'items.stockSource'
        ]);

        return inertia('Transferts/Show', [
            'transfert' => $transfert,
        ]);
    }

    public function approve(Transfert $transfert)
    {
        abort_if($transfert->status !== 'en_attente', 403);

        DB::transaction(function () use ($transfert) {
            $transfert->update([
                'status' => 'approuve',
                'approbateur_id' => auth()->id(),
                'approuve_le' => now(),
            ]);

            $transfert->items()->update(['status' => 'preleve']);
        });

        return back()->with('success', 'Transfert approuvé avec succès');
    }

    public function complete(Transfert $transfert)
    {
        abort_if($transfert->status !== 'approuve', 403);

        DB::transaction(function () use ($transfert) {
            foreach ($transfert->items as $item) {
                // Créer le nouveau stock dans l'hôpital destination
                Stock::create([
                    'medical_produit_id' => $item->medical_produit_id,
                    'hopital_id' => $transfert->to_central ? null : $transfert->to_hospital_id,
                    'quantite' => $item->quantite,
                    'numero_lot' => $item->stockSource->numero_lot ?? null,
                    'date_expiration' => $item->stockSource->date_expiration ?? null,
                    'prix_unitaire' => $item->stockSource->prix_unitaire ?? null,
                    'status' => 'disponible',
                    'ref' => \Illuminate\Support\Str::uuid(),
                ]);

                $item->update(['status' => 'livre']);
            }

            $transfert->update([
                'status' => 'livre',
                'livre_le' => now(),
            ]);
        });

        return back()->with('success', 'Transfert marqué comme livré');
    }

    public function cancel(Transfert $transfert)
    {
        abort_if(!in_array($transfert->status, ['en_attente', 'approuve']), 403);

        DB::transaction(function () use ($transfert) {
            // Restaurer les quantités si le transfert était approuvé
            if ($transfert->status === 'approuve') {
                foreach ($transfert->items as $item) {
                    if ($item->stock_source_id) {
                        $stock = Stock::find($item->stock_source_id);
                        $stock->increment('quantite', $item->quantite);
                    }
                }
            }

            $transfert->update(['status' => 'annule']);
            $transfert->items()->update(['status' => 'annule']);
        });

        return back()->with('success', 'Transfert annulé avec succès');
    }
}