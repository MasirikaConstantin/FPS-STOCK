<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\Hopital;
use App\Models\MedicalProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlertController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
       if($user->isAdminCentral()){
        $query = Alert::with(['hopital', 'user', 'medicalProduit', 'resolvedBy'])
            ->latest();
       }else{
        $query = Alert::where('hopital_id', $user->profile->hopital_id)->with(['hopital', 'user', 'medicalProduit', 'resolvedBy'])
            ->latest();
       }
        if ($request->has('search')) {
            $query->where('titre', 'like', "%{$request->search}%")
                ->orWhere('message', 'like', "%{$request->search}%");
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('priorite')) {
            $query->where('priorite', $request->priorite);
        }

        if ($request->has('is_resolved')) {
            $query->where('is_resolved', $request->is_resolved);
        }

        return Inertia::render('Alerts/Index', [
            'alerts' => $query->paginate(10),
            'filters' => $request->only(['search', 'type', 'priorite', 'is_resolved']),
            'types' => Alert::types(),
            'priorities' => Alert::priorities(),
        ]);
    }

    public function create()
    {
        $user= Auth::user();
        $hopitals=new Hopital;
        if($user->isAdminCentral()){
            $hopitals=Hopital::all();
        }else{
            //dd($user->profile->hopital);
            $hopitals=$user->profile->hopital;
        }
        return Inertia::render('Alerts/Create', [
            'hopitals' => $hopitals,
            'medicalProduits' => MedicalProduit::all(),
            'types' => Alert::types(),
            'priorities' => Alert::priorities(),
        ]);
    }

    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'type' => 'required|in:' . implode(',', array_keys(Alert::types())),
            'priorite' => 'required|in:' . implode(',', array_keys(Alert::priorities())),
            'titre' => 'required|string|max:255',
            'message' => 'required|string',
            'hopital_id' => 'required|exists:hopitals,id',
            'medical_produit_id' => 'nullable|exists:medical_produits,id',
        ]);
        

        $alert = Alert::create([
            ...$validated,
            'user_id' => auth()->id(),
            'ref' => \Illuminate\Support\Str::uuid(),
        ]);

        return redirect()->route('alerts.show', $alert->ref)->with('success', 'Alerte créée avec succès.');
    }

    public function show(string $alert)
    {
        $alert = Alert::where('ref', $alert)->firstOrFail();
        $alert->load(['hopital', 'user', 'medicalProduit', 'resolvedBy']);

        return Inertia::render('Alerts/Show', [
            'alert' => $alert,
            'types' => Alert::types(),
            'priorities' => Alert::priorities(),

        ]);
    }

    public function edit(string $alert)
    {
        $alert = Alert::where('ref', $alert)->firstOrFail();
        return Inertia::render('Alerts/Edit', [
            'alert' => $alert,
            'hopitals' => Hopital::all(),
            'medicalProduits' => MedicalProduit::all(),
            'types' => Alert::types(),
            'priorities' => Alert::priorities(),
        ]);
    }

    public function update(Request $request, string $alert)
    {
        $alert = Alert::where('ref', $alert)->firstOrFail();
        $validated = $request->validate([
            'type' => 'required|in:' . implode(',', array_keys(Alert::types())),
            'priorite' => 'required|in:' . implode(',', array_keys(Alert::priorities())),
            'titre' => 'required|string|max:255',
            'message' => 'required|string',
            'hopital_id' => 'required|exists:hopitals,id',
            'medical_produit_id' => 'nullable|exists:medical_produits,id',
            'is_resolved' => 'boolean',
        ]);

        $alert->update($validated);

        return redirect()->route('alerts.show', $alert->ref)->with('success', 'Alerte mise à jour avec succès.');
    }

    public function resolve(string $cetalert)
    {
        $alert = Alert::where('ref', $cetalert)->firstOrFail();
        $alert->update([
            'is_resolved' => true,
            'resolved_by' => auth()->id(),
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Alerte marquée comme résolue.');
    }

    public function destroy(string $alert)
    {
        $alert = Alert::where('ref', $alert)->firstOrFail();
        $alert->delete();

        return redirect()->route('alerts.index')->with('success', 'Alerte supprimée avec succès.');
    }
}