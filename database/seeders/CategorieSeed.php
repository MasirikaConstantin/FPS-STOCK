<?php

namespace Database\Seeders;

use App\Models\Categorie;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;
class CategorieSeed extends Seeder
{
    /**
     * Run the database seeds.
     */
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Antibiotique', 'Antalgique', 'Anti-inflammatoire', 'Antiseptique', 'Antiviral',
            'Antifongique', 'Cardiovasculaire', 'Neurologique', 'Digestif', 'Respiratoire',
            'Endocrinien', 'Dermatologique', 'Ophtalmologique', 'Gynécologique', 'Urologique',
            'Anesthésique', 'Soluté', 'Vaccin', 'Matériel médical', 'Autre'
        ];

        $descriptions = [
            'Produits utilisés pour traiter les infections bactériennes',
            'Médicaments contre la douleur de différents niveaux',
            'Réduit l\'inflammation et la douleur associée',
            'Prévient la croissance des micro-organismes sur les tissus vivants',
            'Combat les infections virales et renforce le système immunitaire',
            'Traitement des infections fongiques et mycoses',
            'Soins pour le cœur et le système circulatoire',
            'Traitement des troubles du système nerveux',
            'Médicaments pour les problèmes digestifs',
            'Soins pour les affections respiratoires',
            'Traitement des troubles hormonaux',
            'Produits pour les soins de la peau',
            'Médicaments et produits pour la santé oculaire',
            'Soins pour la santé féminine',
            'Traitement des affections urinaires',
            'Médicaments utilisés pour l\'anesthésie',
            'Solutions pour perfusion et réhydratation',
            'Produits de prévention des maladies infectieuses',
            'Equipements et fournitures pour soins médicaux',
            'Autres produits non classés'
        ];

        // Prendre un utilisateur aléatoire comme créateur
        $user = User::inRandomOrder()->first();

        foreach ($categories as $index => $category) {
            Categorie::create([
                'nom' => $category,
                'description' => $descriptions[$index] ?? 'Description pour ' . $category,
                'is_active' => true,
                'ref' => Str::uuid(),
                'created_by' => $user->id,
            ]);
        }
    }
}
