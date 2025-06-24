<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Hopital;
use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $users = User::query()
            ->with(['profile', 'profile.hopital'])
            ->when($user->isAdmin(), function($query) use ($user) {
                $query->whereHas('profile', function($q) use ($user) {
                    $q->where('hopital_id', $user->profile->hopital_id);
                });
            })
            ->when($user->isMedicalStaff(), function($query) use ($user) {
                $query->where('id', $user->id);
            })
            ->latest()
            ->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'canCreate' => $user->isAdminCentral() || $user->isAdmin(),
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $hopitals = [];

        if ($user->isAdminCentral()) {
            $hopitals = Hopital::all();
        } elseif ($user->isAdmin()) {
            $hopitals = Hopital::where('id', $user->profile->hopital_id)->get();
            //dd($hopitals);
        }

        return Inertia::render('Users/Create', [
            'hopitals' => $hopitals,
            'roles' => $user->isAdminCentral() 
                ? ['admin_central', 'admin', 'medecin', 'pharmacien', 'magasinier']
                : ['admin', 'medecin', 'pharmacien', 'magasinier'],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:admin_central,admin,medecin,pharmacien,magasinier',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'hopital_id' => [
                'required_if:role,admin,medecin,pharmacien,magasinier',
                'exists:hopitals,id'
            ],
            'created_by' => 'nullable|exists:users,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
            'created_by' => Auth::user()->id,
        ]);

        $user->profile()->create([
            'phone' => $request->phone,
            'address' => $request->address,
            'hopital_id' => $request->hopital_id,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès');
    }

    public function show(string $user)
    {
        $user = User::where('ref', $user)->firstOrFail();
        $this->authorizeView($user);
        $user->load(["createdBy","updatedBy", "profile.hopital"]);
        $permissions = \DB::table('user_permissions')
            ->where('user_id', $user->id)
            ->join('permissions', 'user_permissions.permission_id', '=', 'permissions.id')
            ->leftJoin('users as grantors', 'user_permissions.granted_by', '=', 'grantors.id')
            ->select([
                'permissions.id',
                'permissions.name',
                'permissions.module',
                'permissions.action',
                'grantors.name as granted_by_name',
                'user_permissions.granted_at',
            ])
            ->get();
    
            $stats = $user->loadCount([
                'alerts as total_alertes_crees',
                'alerts as alertes_resolues' => function($query) {
                    $query->where('is_resolved', true);
                },
                'stockMouvements as mouvements_stock_crees',
                'transfertsInities as transferts_inities',
                'medicalProduits as produits_ajoutes'
            ]);
    
            // Ajoutez des statistiques supplémentaires
            $stats->alertes_par_type = $user->alerts()
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type');
    
            $stats->mouvements_par_type = $user->stockMouvements()
                ->selectRaw('type, count(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type');

        // ⬇️ Injecter la collection dans l'objet User
        $user->permissions = $permissions;
    
        return Inertia::render('Users/Show', [
            'user' => $user,
            'canEdit' => $this->canEdit($user),
            'stats'=>$stats
        ]);
    }    

    public function edit(string $user)
    {
        $user = User::where('ref', $user)->firstOrFail();
        $this->authorizeView($user);
        $authUser = Auth::user();

        $hopitals = [];
        if ($authUser->isAdminCentral()) {
            $hopitals = Hopital::all();
        } elseif ($authUser->isAdmin()) {
            $hopitals = Hopital::where('id', $authUser->profile->hopital_id)->get();
        }

        $user->load('profile');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'hopitals' => $hopitals,
            'roles' => $authUser->isAdminCentral() 
                ? ['admin_central', 'admin', 'medecin', 'pharmacien', 'magasinier']
                : ['admin', 'medecin', 'pharmacien', 'magasinier'],
        ]);
    }

    public function update(Request $request, User $user)
{
    $this->authorizeView($user);

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        'role' => 'required|in:admin_central,admin,medecin,pharmacien,magasinier',
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'hopital_id' => [
            'required_if:role,admin,medecin,pharmacien,magasinier',
            'exists:hopitals,id'
        ],
        'is_active' => 'boolean',
        'updated_by' => 'nullable|exists:users,id',
    ]);

    // Mise à jour des informations de base de l'utilisateur
    $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'role' => $validated['role'],
        'is_active' => $validated['is_active'] ?? false,
        'updated_by' => Auth::user()->id,
    ]);

    // Gestion du profil (création ou mise à jour)
    $profileData = [
        'phone' => $validated['phone'],
        'address' => $validated['address'],
        'hopital_id' => $validated['hopital_id'] ?? null,
    ];

    // Utilisation de updateOrCreate pour gérer les deux cas
    $user->profile()->updateOrCreate(
        ['user_id' => $user->id], // Conditions de recherche
        $profileData // Données à mettre à jour ou créer
    );

    return redirect()->route('users.index')
        ->with('success', 'Utilisateur mis à jour avec succès');
}

    public function destroy(User $user)
    {
        $this->authorizeView($user);
        
        $user->delete();
        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé avec succès');
    }

    private function authorizeView(User $user)
    {
        $authUser = Auth::user();

        if ($authUser->isAdmin()) {
            if ($user->profile->hopital_id !== $authUser->profile->hopital_id) {
                abort(403);
            }
        } elseif ($authUser->isMedicalStaff() && $user->id !== $authUser->id) {
            abort(403);
        }
    }

    private function canEdit(User $user): bool
    {
        $authUser = Auth::user();
        
        return $authUser->isAdminCentral() || 
               ($authUser->isAdmin() && $user->profile->hopital_id === $authUser->profile->hopital_id) ||
               $authUser->id === $user->id;
    }
}