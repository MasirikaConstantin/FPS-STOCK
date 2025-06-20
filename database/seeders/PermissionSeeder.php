<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use Illuminate\Support\Str;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // database/seeders/PermissionSeeder.php
    // database/seeders/PermissionSeeder.php


public function run()
{
    $modules = [
        'divisions' => [
            'view' => 'Voir les divisions administratives',
            'create' => 'Créer des divisions',
            'edit' => 'Modifier des divisions',
            'delete' => 'Supprimer des divisions'
        ],
        'alerts' => [
            'view' => 'Voir les alertes',
            'create' => 'Créer des alertes',
            'manage' => 'Gérer les alertes'
        ],
        'articles' => [
            'view' => 'Voir les articles',
            'create' => 'Créer des articles',
            'edit' => 'Modifier des articles',
            'publish' => 'Publier des articles'
        ]
    ];

    foreach ($modules as $module => $actions) {
        foreach ($actions as $action => $description) {
            Permission::create([
                'name' => "$module.$action",
                'description' => $description,
                'module' => $module,
                'action' => $action,
                'ref' => Str::uuid()
            ]);
        }
    }
}
}
