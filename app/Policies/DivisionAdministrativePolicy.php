<?php

namespace App\Policies;

use App\Models\DivisionAdministrative;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DivisionAdministrativePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->can('view divisions');
    }

    public function view(User $user, DivisionAdministrative $division)
    {
        return $user->can('view divisions');
    }

    public function create(User $user)
    {
        // Admin central peut créer, admin normal sera vérifié dans le contrôleur
        return $user->role === 'admin_central' && $user->can('create divisions');

        
    }

    public function update(User $user, DivisionAdministrative $division)
    {
        // Admin central peut tout modifier
        if ($user->role === 'admin_central' && $user->can('edit divisions')) {
            return true;
        }
        
        // Admin normal ne peut modifier que si la division contient son hôpital
        if ($user->role === 'admin' && $user->can('edit divisions')) {
            return $division->hospitals()->where('id', $user->hospital_id)->exists();
        }
        
        return false;
    }

    public function delete(User $user, DivisionAdministrative $division)
    {
        // Seul admin_central peut supprimer
        return $user->role === 'admin_central' && 
               $user->can('delete divisions') && 
               !$division->children()->exists();
    }
}