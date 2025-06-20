<?php

namespace App\Policies;

use App\Models\DivisionAdministrative;
use App\Models\User;

class DivisionAdministrativePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission('divisions', 'view');
    }

    public function view(User $user, DivisionAdministrative $division): bool
    {
        return $user->hasPermission('divisions', 'view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('divisions', 'create');
    }

    public function update(User $user, DivisionAdministrative $division): bool
    {
        return $user->hasPermission('divisions', 'update');
    }

    public function edit(User $user, DivisionAdministrative $division): bool
    {
        return $user->hasPermission('divisions', 'edit');
    }

    public function delete(User $user, DivisionAdministrative $division): bool
    {
        return $user->hasPermission('divisions', 'delete');
    }
}