<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategorieController extends Controller
{
    /****/
     public function index()
    {
        $categories = Categorie::query()
            ->with('creator')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255|unique:categories',
        'description' => 'nullable|string',
        'is_active' => 'boolean',
    ]);

    $validated['created_by'] =Auth::user()->id;

    Categorie::create($validated);

    return redirect()->route('categories.index')->with('success', 'Catégorie créée avec succès.');
}

    public function show(string $categorie)
    {
        $categorie = Categorie::where('ref', $categorie)->firstOrFail();
        return Inertia::render('Categories/Show', [
            'category' => $categorie->load('creator', 'updater'),
        ]);
    }

    public function edit(string $categorie)
    {
        $categorie = Categorie::where('ref', $categorie)->firstOrFail();

        return Inertia::render('Categories/Edit', [
            'category' => $categorie,
        ]);
    }

    public function update(Request $request, string $categorie)
    {
        $categorie = Categorie::where('id', $categorie)->firstOrFail();
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom,'.$categorie->id,
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);
    $validated['updated_by'] =Auth::user()->id;


        $categorie->update($validated);

        return redirect()->route('categories.index')->with('success', 'Catégorie mise à jour avec succès.');
    }

    public function destroy(string $categorie)
    {
        $categorie = Categorie::where('id', $categorie)->firstOrFail();
        $categorie->delete();

        return redirect()->route('categories.index')->with('success', 'Catégorie supprimée avec succès.');
    }
}
