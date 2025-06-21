<?php

namespace App\Http\Controllers;

use App\Models\Transfert;
use App\Models\Hopital;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TransfertController extends Controller
{
    public function index()
    {
        return Inertia::render('Transferts/Index', [
            'transferts' => Transfert::with(['fromHospital', 'toHospital', 'demandeur'])
                ->orderBy('created_at', 'desc')
                ->get(),
            'hopitals' => Hopital::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Transferts/Create', [
            'hopitals' => Hopital::all(),
            'stocks' => Stock::with(['medicalProduit', 'hopital'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'from_hospital_id' => 'required_without:from_central',
            'to_hospital_id' => 'required_without:to_central',
            'from_central' => 'boolean',
            'to_central' => 'boolean',
            'priorite' => 'required|in:faible,moyen,eleve,urgent',
            'articles' => 'required|array|min:1',
            'articles.*.stock_id' => 'required|exists:stocks,id',
            'articles.*.quantite' => 'required|integer|min:1',
        ]);
    
        DB::transaction(function () use ($request) {
            $transfert = Transfert::create([
                'ref' => Str::uuid(),
                'from_hospital_id' => $request->from_central ? null : $request->from_hospital_id,
                'to_hospital_id' => $request->to_central ? null : $request->to_hospital_id,
                'from_central' => $request->from_central,
                'to_central' => $request->to_central,
                'priorite' => $request->priorite,
                'notes' => $request->notes,
                'demandeur_id' => auth()->id(),
                'created_by' => auth()->id(),
            ]);
    
            foreach ($request->articles as $article) {
                $transfert->articles()->create([
                    'ref' => Str::uuid(),
                    'stock_id' => $article['stock_id'],
                    'medical_produit_id' => Stock::find($article['stock_id'])->medical_produit_id,
                    'quantite' => $article['quantite'],
                    'from_central' => $request->from_central,
                    'created_by' => auth()->id(),
                ]);
            }
        });
    
        return redirect()->route('transferts.index');
    }

    public function show(Transfert $transfert)
    {
        return Inertia::render('Transferts/Show', [
            'transfert' => $transfert->load([
                'fromHospital', 
                'toHospital', 
                'demandeur', 
                'approbateur',
                'createdBy',
                'updatedBy',
                'articles.stock.medicalProduit'
            ]),
        ]);
    }

    public function edit(Transfert $transfert)
    {
        if ($transfert->status !== 'en_attente') {
            abort(403, 'Seuls les transferts en attente peuvent être modifiés');
        }

        return Inertia::render('Transferts/Edit', [
            'transfert' => $transfert->load(['articles.stock.medicalProduit']),
            'hopitals' => Hopital::all(),
            'stocks' => Stock::with(['medicalProduit', 'hopital'])->get(),
        ]);
    }

    public function update(Request $request, Transfert $transfert)
    {
        if ($transfert->status !== 'en_attente') {
            abort(403, 'Seuls les transferts en attente peuvent être modifiés');
        }

        $request->validate([
            'from_hospital_id' => 'required|exists:hopitals,id',
            'to_hospital_id' => 'required|exists:hopitals,id|different:from_hospital_id',
            'priorite' => 'required|in:faible,moyen,eleve,urgent',
            'articles' => 'required|array|min:1',
            'articles.*.stock_id' => 'required|exists:stocks,id',
            'articles.*.quantite' => 'required|integer|min:1',
        ]);

        DB::transaction(function () use ($request, $transfert) {
            $transfert->update([
                'from_hospital_id' => $request->from_hospital_id,
                'to_hospital_id' => $request->to_hospital_id,
                'priorite' => $request->priorite,
                'notes' => $request->notes,
                'updated_by' => auth()->id(),
            ]);

            // Supprimer les anciens articles
            $transfert->articles()->delete();

            // Ajouter les nouveaux articles
            foreach ($request->articles as $article) {
                $transfert->articles()->create([
                    'ref' => Str::uuid(),
                    'stock_id' => $article['stock_id'],
                    'medical_produit_id' => Stock::find($article['stock_id'])->medical_produit_id,
                    'quantite' => $article['quantite'],
                    'created_by' => auth()->id(),
                ]);
            }
        });

        return redirect()->route('transferts.index');
    }

    public function destroy(Transfert $transfert)
    {
        if ($transfert->status !== 'en_attente') {
            abort(403, 'Seuls les transferts en attente peuvent être supprimés');
        }

        $transfert->delete();
        return redirect()->route('transferts.index');
    }

    public function approve(Transfert $transfert)
    {
        if ($transfert->status !== 'en_attente') {
            abort(403, 'Seuls les transferts en attente peuvent être approuvés');
        }

        DB::transaction(function () use ($transfert) {
            // Vérifier que les stocks sont disponibles
            foreach ($transfert->articles as $article) {
                $stock = Stock::find($article->stock_id);
                if ($stock->quantite < $article->quantite) {
                    abort(422, "Stock insuffisant pour {$stock->medicalProduit->name}");
                }
            }

            // Réserver les stocks
            foreach ($transfert->articles as $article) {
                $stock = Stock::find($article->stock_id);
                $stock->decrement('quantite', $article->quantite);
                $article->update(['status' => 'preleve']);
            }

            $transfert->update([
                'status' => 'approuve',
                'approbateur_id' => auth()->id(),
                'approuve_le' => now(),
            ]);
        });

        return redirect()->back();
    }

    public function deliver(Transfert $transfert)
    {
        if ($transfert->status !== 'approuve') {
            abort(403, 'Seuls les transferts approuvés peuvent être livrés');
        }

        DB::transaction(function () use ($transfert) {
            // Ajouter les stocks à l'hôpital destination
            foreach ($transfert->articles as $article) {
                $destinationStock = Stock::firstOrCreate([
                    'medical_produit_id' => $article->medical_produit_id,
                    'hopital_id' => $transfert->to_hospital_id,
                ], [
                    'quantite' => 0,
                    'status' => 'disponible',
                    'ref' => Str::uuid(),
                    'created_by' => auth()->id(),
                ]);

                $destinationStock->increment('quantite', $article->quantite);
                $article->update(['status' => 'livre']);
            }

            $transfert->update([
                'status' => 'livre',
                'livre_le' => now(),
            ]);
        });

        return redirect()->back();
    }

    public function cancel(Transfert $transfert)
    {
        if (!in_array($transfert->status, ['en_attente', 'approuve'])) {
            abort(403, 'Seuls les transferts en attente ou approuvés peuvent être annulés');
        }

        DB::transaction(function () use ($transfert) {
            // Si le transfert était approuvé, restituer les stocks
            if ($transfert->status === 'approuve') {
                foreach ($transfert->articles as $article) {
                    $stock = Stock::find($article->stock_id);
                    $stock->increment('quantite', $article->quantite);
                }
            }

            $transfert->update([
                'status' => 'annule',
                'updated_by' => auth()->id(),
            ]);

            $transfert->articles()->update(['status' => 'annule']);
        });

        return redirect()->back();
    }
}