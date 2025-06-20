<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return $user->isAdminCentral() || $user->isAdmin();
    }

    public function view(User $user, User $model)
    {
        if ($user->isAdminCentral()) {
            return true;
        }

        if ($user->isAdmin()) {
            return $user->profile->hospital_id === $model->profile->hospital_id;
        }

        return $user->id === $model->id;
    }

    public function create(User $user)
    {
        return $user->isAdminCentral() || $user->isAdmin();
    }

    public function update(User $user, User $model)
    {
        if ($user->isAdminCentral()) {
            return true;
        }

        if ($user->isAdmin()) {
            return $user->profile->hospital_id === $model->profile->hospital_id;
        }

        return $user->id === $model->id;
    }

    public function delete(User $user, User $model)
    {
        // Un utilisateur ne peut pas se supprimer lui-même
        if ($user->id === $model->id) {
            return false;
        }

        if ($user->isAdminCentral()) {
            return true;
        }

        if ($user->isAdmin()) {
            return $user->profile->hospital_id === $model->profile->hospital_id;
        }

        return false;
    }
}