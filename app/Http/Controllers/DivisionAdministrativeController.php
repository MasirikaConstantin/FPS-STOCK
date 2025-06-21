<?php

namespace App\Http\Controllers;

use App\Models\DivisionAdministrative;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DivisionAdministrativeController extends Controller
{
    public function index()
{
    /*if (Gate::denies('viewAny', DivisionAdministrative::class)) {
        abort(403);
    }*/

    $divisions = DivisionAdministrative::query()
        ->with(['parent', 'creator'])
        ->latest()
        ->get()
        ->groupBy('type');

    return Inertia::render('Divisions/Index', [
        'provinces' => $divisions['province'] ?? [],
        'territoires' => $divisions['territoire'] ?? [],
        'villes' => $divisions['ville'] ?? [],
        'communes' => $divisions['commune'] ?? [],
        'canCreate' => auth()->user()->can('create', DivisionAdministrative::class),
    ]);
}
    public function create()
    {
        $types = ['province', 'territoire', 'ville', 'commune'];
        $parents = DivisionAdministrative::where('is_active', true)
            ->get(['id', 'nom', 'type']);
        
        return Inertia::render('Divisions/Create', [
            'types' => $types,
            'parents' => $parents,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:province,territoire,ville,commune',
            'code' => 'nullable|string|max:50|unique:division_administraves,code',
            'parent_id' => [
                'nullable',
                'exists:division_administraves,id',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type === 'province' && $value !== null) {
                        $fail('Une province ne peut pas avoir de parent.');
                    }
                    if ($request->type === 'territoire') {
                        $parent = DivisionAdministrative::find($value);
                        if ($parent && $parent->type !== 'province') {
                            $fail('Un territoire doit avoir une province comme parent.');
                        }
                    }
                    if ($request->type === 'ville') {
                        $parent = DivisionAdministrative::find($value);
                        if ($parent && $parent->type !== 'territoire') {
                            $fail('Une ville doit avoir un territoire comme parent.');
                        }
                    }
                },
            ],
            'is_active' => 'boolean',
        ]);

        $division = DivisionAdministrative::create([
            ...$validated,
            'created_by' => auth()->id(),
            'ref' => \Illuminate\Support\Str::uuid(),
        ]);

        return redirect()->route('divisions.index')
            ->with('success', 'Division administrative créée avec succès');
    }

    public function show(string $division)
    {
        $division = DivisionAdministrative::where('ref', $division)->firstOrFail();
        $division->load(['parent', 'children', 'creator']);
        return Inertia::render('Divisions/Show', [
            'division' => $division,
            'hierarchy' => $division->hierarchy,

            'canEdit' => auth()->user()->can('edit', $division),
        ]);
    }

    public function edit(string $division)
    {
        $division = DivisionAdministrative::where('ref', $division)->firstOrFail();
        $types = ['province', 'territoire', 'ville','commune'];
        $parents = DivisionAdministrative::query()
            ->where('id', '!=', $division->id)
            ->get(['id', 'nom', 'type']);

        return Inertia::render('Divisions/Edit', [
            'division' => $division,
            'types' => $types,
            'parents' => $parents,
        ]);
    }

    public function update(Request $request, DivisionAdministrative $division)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'type' => 'required|in:province,territoire,ville,commune',
            'code' => 'nullable|string|max:50|unique:division_administraves,code,'.$division->id,
            'parent_id' => [
                'nullable',
                'exists:division_administraves,id',
                function ($attribute, $value, $fail) use ($request, $division) {
                    if ($request->type === 'province' && $value !== null) {
                        $fail('Une province ne peut pas avoir de parent.');
                    }
                    if ($request->type === 'territoire') {
                        if ($value && DivisionAdministrative::find($value)->type !== 'province') {
                            $fail('Un territoire doit avoir une province comme parent.');
                        }
                    }
                    if ($request->type === 'ville') {
                        if ($value && DivisionAdministrative::find($value)->type !== 'territoire') {
                            $fail('Une ville doit avoir un territoire comme parent.');
                        }
                    }
                    // Empêcher de se définir soi-même comme parent
                    if ($value === $division->id) {
                        $fail('Une division ne peut pas être son propre parent.');
                    }
                    // Empêcher de créer des références circulaires
                    $childrenIds = $division->children()->pluck('id')->toArray();
                    if (in_array($value, $childrenIds)) {
                        $fail('Cette relation créerait une référence circulaire.');
                    }
                },
            ],
            'is_active' => 'boolean',
        ]);

        $division->update($validated);

        return redirect()->route('divisions.index')
            ->with('success', 'Division administrative mise à jour avec succès');
    }

    public function destroy(DivisionAdministrative $division)
    {
        if ($division->children()->exists()) {
            return back()->with('error', 'Impossible de supprimer : cette division a des subdivisions.');
        }

        $division->delete();

        return redirect()->route('divisions.index')
            ->with('success', 'Division administrative supprimée avec succès');
    }

    public function getByType(Request $request)
    {
        $request->validate([
            'type' => 'required|in:province,territoire,ville,commune',
            'parent_id' => 'nullable|exists:division_administraves,id',
        ]);

        $divisions = DivisionAdministrative::query()
            ->where('type', $request->type)
            ->when($request->parent_id, function ($query) use ($request) {
                $query->where('parent_id', $request->parent_id);
            })
            ->get(['id', 'nom']);

        return response()->json($divisions);
    }
}