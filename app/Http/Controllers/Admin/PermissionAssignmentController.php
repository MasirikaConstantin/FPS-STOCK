<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Permission;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class PermissionAssignmentController extends Controller
{
    public function accueil()
    {
        return Inertia::render('Admin/Permissions/Accueil', [
            'permissions' => Permission::with(['users' => function($query) {
                $query->select('users.id', 'users.name', 'users.email');
            }])->get(),
            
            // Ou si vous préférez une approche séparée :
            'userPermissions' => UserPermission::with(['user', 'permission'])->get()
        ]);
    }
    public function index()
    {
        return Inertia::render('Admin/Permissions/Assign', [
            'users' => User::select('id', 'name', 'email')->get(),
            'permissions' => Permission::all()
                ->groupBy('module')
                ->map(function ($items) {
                    return $items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->name,
                            'action' => $item->action,
                            'description' => $item->description
                        ];
                    });
                }),

            'current_permissions' => UserPermission::with('permission')
                ->get()
                ->groupBy('user_id')
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
            'user_id' => 'required|exists:users,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }

        // Supprimer les anciennes permissions
        UserPermission::where('user_id', $request->user_id)->delete();

        // Ajouter les nouvelles permissions
        foreach ($request->permissions as $permissionId) {
            UserPermission::create([
                'user_id' => $request->user_id,
                'permission_id' => $permissionId,
                'granted_by' => Auth::user()->id
            ]);
        }

        return redirect()->back()->with('success', 'Permissions mises à jour avec succès');
    }

    public function destroy(Permission $permission)
{
    try {
        $permission->delete();
        return redirect()->back()->with('success', 'Permission supprimée avec succès');
    } catch (\Exception $e) {
        return redirect()->back()->with('error', 'Erreur lors de la suppression');
    }
}

    public function create()
    {
        // Récupère tous les modèles Eloquent
        $models = collect(File::allFiles(app_path('Models')))
            ->map(function ($item) {
                $path = $item->getRelativePathName();
                return str_replace('/', '\\', substr($path, 0, strrpos($path, '.')));
            })
            ->filter(fn ($model) => !in_array($model, ['User', 'Permission', 'UserPermission']));

        // Permissions standards pour chaque modèle
        $defaultPermissions = [
            'view' => 'Voir',
            'create' => 'Créer',
            'edit' => 'Modifier',
            'delete' => 'Supprimer',
            'manage' => 'Gérer complètement'
        ];

        return Inertia::render('Admin/Permissions/Create', [
            'models' => $models,
            'defaultPermissions' => $defaultPermissions
        ]);
    }


    public function storePermission(Request $request)
    {
        $validated = $request->validate([
            'model' => 'required|string',
            'permissions' => 'required|array',
            'permissions.*' => 'string'
        ]);
    
        $createdCount = 0;
        $skippedCount = 0;
        $errors = [];
    
        foreach ($request->permissions as $permission) {
            try {
                // Vérifie si la permission existe déjà
                if (Permission::where('name', $permission)->exists()) {
                    $skippedCount++;
                    continue;
                }
    
                // Découpe la permission (ex: "articles.view")
                [$module, $action] = explode('.', $permission);
                
                // Format cohérent avec la convention Laravel
                $module = strtolower(Str::plural(Str::singular($module)));
    
                Permission::create([
                    'name' => $permission,
                    'description' => $this->getDefaultDescription($action, $module),
                    'module' => $module,
                    'action' => $action,
                    'ref' => Str::orderedUuid(),
                ]);
    
                $createdCount++;
                
            } catch (\Exception $e) {
                $errors[] = "Erreur avec la permission '$permission': " . $e->getMessage();
            }
        }
    
        // Préparation du message de retour
        $messages = [];
        if ($createdCount > 0) {
            $messages['success'] = "$createdCount permission(s) créée(s) avec succès";
        }
        if ($skippedCount > 0) {
            $messages['warning'] = "$skippedCount permission(s) existaient déjà et ont été ignorées";
        }
        if (!empty($errors)) {
            $messages['error'] = implode('<br>', $errors);
        }
    
        return redirect()
            ->route('admin.permissions.index')
            ->with($messages);
    }

private function getDefaultDescription($action, $module)
{
    $descriptions = [
        'view' => "Voir les {$module}s",
        'create' => "Créer des {$module}s",
        'edit' => "Modifier des {$module}s",
        'delete' => "Supprimer des {$module}s",
        'manage' => "Gérer complètement les {$module}s"
    ];

    return $descriptions[$action] ?? "Permission pour {$action} sur {$module}";
}

public function edit(string $permission)
{
    $permission = Permission::where('ref', $permission)->firstOrFail();
    return Inertia::render('Admin/Permissions/Edit', [
        'permission' => $permission,
        'users' => User::select('id', 'name', 'email')->get(),
        'assignedUsers' => $permission->users->pluck('id')->toArray()
    ]);

}
public function update(Request $request, Permission $permission)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255|unique:permissions,name,'.$permission->id,
        'description' => 'nullable|string|max:1000',
        'module' => 'required|string|max:255',
        'action' => 'required|string|max:255'
    ]);


    $permission->update($validated);

    return redirect()->route('admin.permissions.index')
        ->with('success', 'Permission mise à jour avec succès');
}



}