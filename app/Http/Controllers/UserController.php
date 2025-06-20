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
            ->with(['profile', 'profile.hospital'])
            ->when($user->isAdmin(), function($query) use ($user) {
                $query->whereHas('profile', function($q) use ($user) {
                    $q->where('hospital_id', $user->profile->hospital_id);
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
        $hospitals = [];

        if ($user->isAdminCentral()) {
            $hospitals = Hopital::all();
        } elseif ($user->isAdmin()) {
            $hospitals = Hopital::where('id', $user->profile->hospital_id)->get();
        }

        return Inertia::render('Users/Create', [
            'hospitals' => $hospitals,
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
            'hospital_id' => [
                'required_if:role,admin,medecin,pharmacien,magasinier',
                'exists:hospitals,id'
            ],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_active' => true,
        ]);

        $user->profile()->create([
            'phone' => $request->phone,
            'address' => $request->address,
            'hospital_id' => $request->hospital_id,
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès');
    }

    public function show(string $user)
    {
        $user = User::where('ref', $user)->firstOrFail();
        $this->authorizeView($user);
        $user->load(['profile', 'profile.hospital', 'permissions']);

        return Inertia::render('Users/Show', [
            'user' => $user,
            'canEdit' => $this->canEdit($user),
        ]);
    }

    public function edit(string $user)
    {
        $user = User::where('ref', $user)->firstOrFail();
        $this->authorizeView($user);
        $authUser = Auth::user();

        $hospitals = [];
        if ($authUser->isAdminCentral()) {
            $hospitals = Hopital::all();
        } elseif ($authUser->isAdmin()) {
            $hospitals = Hopital::where('id', $authUser->profile->hospital_id)->get();
        }

        $user->load('profile');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'hospitals' => $hospitals,
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
        'hospital_id' => [
            'required_if:role,admin,medecin,pharmacien,magasinier',
            'exists:hospitals,id'
        ],
        'is_active' => 'boolean',
    ]);

    // Mise à jour des informations de base de l'utilisateur
    $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'role' => $validated['role'],
        'is_active' => $validated['is_active'] ?? false,
    ]);

    // Gestion du profil (création ou mise à jour)
    $profileData = [
        'phone' => $validated['phone'],
        'address' => $validated['address'],
        'hospital_id' => $validated['hospital_id'] ?? null,
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
            if ($user->profile->hospital_id !== $authUser->profile->hospital_id) {
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
               ($authUser->isAdmin() && $user->profile->hospital_id === $authUser->profile->hospital_id) ||
               $authUser->id === $user->id;
    }
}