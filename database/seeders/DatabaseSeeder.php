<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\User;
use App\Models\DivisionAdministrative;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        //DivisionAdministrative::factory()->province()->create();
        /*DivisionAdministrative::factory()->ville()->create([
            'parent_id' => 1
        ]);*/
        /*DivisionAdministrative::factory()->commune()->count(23)->create([
            'parent_id' => 2
        ]);*/

        /*$province = DivisionAdministrative::factory()->province()->create();
        $ville = DivisionAdministrative::factory()->ville()->create(['parent_id' => $province->id]);
        $communes = DivisionAdministrative::factory()->commune()->count(23)->create(['parent_id' => $ville->id]);*/

        Categorie::factory(30)->create();
    }
}
