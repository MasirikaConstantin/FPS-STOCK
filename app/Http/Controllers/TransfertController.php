<?php

namespace App\Http\Controllers;

use App\Models\Transfert;
use App\Models\MedicalProduit;
use App\Models\Hopital;
use App\Models\Stock;
use App\Models\StockMouvement;
use COM;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class TransfertController extends Controller
{
    public function index()
    {
        if(Auth::user()->role === "admin_central"){
            $transferts = Transfert::with(['fromHospital', 'toHospital', 'demandeur', 'items.medicalProduit'])
            ->latest()
            ->paginate(10);
            return inertia('Transferts/Index', [
                'transferts' => $transferts,
            ]);
    }
        elseif(Auth::user()->profile){
            if(Auth::user()->profile->hopital_id){
                $hopital = Auth::user()->profile->hopital_id;
                $transferts = Transfert::where('from_hospital_id', $hopital)->
                orWhere('to_hospital_id', $hopital)
                ->with(['fromHospital', 'toHospital', 'demandeur', 'items.medicalProduit'])
                ->latest()
                ->paginate(10);
                return inertia('Transferts/Index', [
                    'transferts' => $transferts,
                ]);
            }
            
        }
        return inertia('Transferts/Index', [
            'transferts' =>  new Paginator([], 10, 1, [
                'path' => Paginator::resolveCurrentPath(),
            ]),
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
                "created_by" => ['nullable', 'exists:users,id'],
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
                'created_by' => $validated['created_by'] ?? auth()->id(),
                'ref' => \Illuminate\Support\Str::uuid(),
            ]);
            $validated['items'] = array_map(function ($item) use ($validated) {
                $item['hospital_id'] = $validated['to_hospital_id'];
                return $item;
            }, $validated['items']);
            
            //dd($validated['items']);
            foreach ($validated['items'] as $item) {
                $transfert->items()->create([
                    'medical_produit_id' => $item['medical_produit_id'],
                    'stock_source_id' => $item['stock_source_id'],
                    'from_central' => $item['from_central'],
                    'quantite' => $item['quantite'],
                    'status' => 'en_attente',
                    'ref' => \Illuminate\Support\Str::uuid(),
                ]);

                StockMouvement::create([
                    'transfert_id' => $transfert->id,
                    'type' => 'transfert',
                    'quantite' => $item['quantite'],
                    //"raison"=>$item['raison'],
                    "notes"=>$item['notes'] ?? null,
                    "medical_produit_id"=>$item['medical_produit_id'],
                    "hopital_id"=>$item['hospital_id'] ?? null,
                    "created_by"=>auth()->id(),
                    "updated_by"=>auth()->id(),
                    
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

    public function show(string $transfert)
    {
        $transfert = Transfert::where('ref', $transfert)->firstOrFail();
        $transfert->load([
            'fromHospital',
            'toHospital',
            'demandeur',
            'approbateur',
            'createdBy',
            'items.medicalProduit',
            'items.stockSource.hopital' // Charge l'hôpital du stock source
        ]);

        return inertia('Transferts/Show', [
            'transfert' => $transfert,
        ]);
    }

    public function approve(string $letransfert)
    {
        
        
        $transfert = Transfert::where('ref', $letransfert)->firstOrFail();
        
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

    public function complete(string $letransferta)
    {
        $transfert = Transfert::where('ref', $letransferta)->firstOrFail();
        abort_if($transfert->status !== 'approuve', 403);
        DB::transaction(function () use ($transfert) {
            foreach ($transfert->items as $item) {
                // Créer le nouveau stock dans l'hôpital destination
                //dd($item->stockSource);

                Stock::create([
                    'medical_produit_id' => $item->medical_produit_id,
                    'hopital_id' => $transfert->to_central ? null : $transfert->to_hospital_id,
                    'quantite' => $item->quantite,
                    'numero_lot' => $item->stockSource->numero_lot ?? null,
                    'date_expiration' => $item->stockSource->date_expiration ?? null,
                    'prix_unitaire' => $item->stockSource->prix_unitaire ?? null,
                    'status' => 'disponible',
                    "created_by"=>Auth::user()->id,
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

    public function cancel(string $letransfertb)
    {
        $transfert = Transfert::where('ref', $letransfertb)->firstOrFail();
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