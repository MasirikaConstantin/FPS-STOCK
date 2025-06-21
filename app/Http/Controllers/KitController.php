<?php

namespace App\Http\Controllers;

use App\Models\Kit;
use App\Models\Categorie;
use App\Models\MedicalProduit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class KitController extends Controller
{
    public function index()
    {
        $kits = Kit::with(['items', 'category'])
            ->withCount('items')
            ->get();
        $stats = [
            'active_kits' => $kits->where('is_active', true)->count(),
            'inactive_kits' => $kits->where('is_active', false)->count(),
            'total_items' => $kits->sum('items_count'),
            'unique_types' => $kits->groupBy('type')->count(),
        ];

        return Inertia::render('Kits/Index', [
            'kits' => Kit::with(['categorie', 'created_by', 'articles.medical_produit'])
                ->orderBy('created_at', 'desc')
                ->get(),
                'stats' => $stats,

            'categories' => Categorie::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Kits/Create', [
            'categories' => Categorie::all(),
            'produits' => MedicalProduit::select(['id', 'name', 'unite'])->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'articles' => 'required|array|min:1',
            'articles.*.medical_produit_id' => 'required|exists:medical_produits,id',
            'articles.*.quantite' => 'required|integer|min:1',
        ]);

        $kit = Kit::create([
            'ref' => Str::uuid(),
            'nom' => $request->nom,
            'description' => $request->description,
            'categorie_id' => $request->categorie_id,
            'is_active' => $request->is_active ?? true,
            'created_by' => auth()->id(),
        ]);

        foreach ($request->articles as $article) {
            $kit->articles()->create([
                'ref' => Str::uuid(),
                'medical_produit_id' => $article['medical_produit_id'],
                'quantite' => $article['quantite'],
                'created_by' => auth()->id(),
            ]);
        }

        return redirect()->route('kits.index');
    }

    public function show(string $kit)
    {
        $kit = Kit::where('ref', $kit)->firstOrFail();
        return Inertia::render('Kits/Show', [
            'kit' => $kit->load(['categorie', 'created_by', 'updated_by', 'articles.medical_produit']),
            'categories' => Categorie::all(),
        ]);
    }

    public function edit(string $kit)
    {
        $kit = Kit::where('ref', $kit)->firstOrFail();
        return Inertia::render('Kits/Edit', [
            'kit' => $kit->load(['articles.medicalProduit']),
            'categories' => Categorie::all(),
            'produits' => MedicalProduit::select(['id', 'name', 'unite'])->get(),
        ]);
    }

    public function update(Request $request, string $kit)
    {
        $kit = Kit::where('ref', $kit)->firstOrFail();
        $request->validate([
            'nom' => 'required|string|max:255',
            'categorie_id' => 'required|exists:categories,id',
            'articles' => 'required|array|min:1',
            'articles.*.medical_produit_id' => 'required|exists:medical_produits,id',
            'articles.*.quantite' => 'required|integer|min:1',
        ]);

        $kit->update([
            'nom' => $request->nom,
            'description' => $request->description,
            'categorie_id' => $request->categorie_id,
            'is_active' => $request->is_active ?? true,
            'updated_by' => auth()->id(),
        ]);

        // Sync articles
        $existingArticles = $kit->articles->keyBy('ref');
        $newArticles = collect($request->articles);

        // Delete removed articles
        $kit->articles()
            ->whereNotIn('ref', $newArticles->pluck('ref')->filter())
            ->delete();

        // Update or create articles
        foreach ($request->articles as $article) {
            if (isset($article['ref'])) {
                $kit->articles()
                    ->where('ref', $article['ref'])
                    ->update([
                        'medical_produit_id' => $article['medical_produit_id'],
                        'quantite' => $article['quantite'],
                        'updated_by' => auth()->id(),
                    ]);
            } else {
                $kit->articles()->create([
                    'ref' => Str::uuid(),
                    'medical_produit_id' => $article['medical_produit_id'],
                    'quantite' => $article['quantite'],
                    'created_by' => auth()->id(),
                ]);
            }
        }

        return redirect()->route('kits.index');
    }

    public function destroy(string $kit)
    {
        $kit = Kit::where('ref', $kit)->firstOrFail();
        $kit->delete();
        return redirect()->route('kits.index');
    }
}