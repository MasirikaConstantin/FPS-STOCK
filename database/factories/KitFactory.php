<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

class KitFactory extends Factory
{
    public function definition(): array
    {
        // Catégories adaptées pour les kits
        $categories = Categorie::whereIn('nom', [
            'Kits de premiers soins',
            'Kits chirurgicaux',
            'Kits obstétriques',
            'Kits d\'urgence'
        ])->get();

        $categorie = $categories->isEmpty() 
            ? Categorie::factory()->create(['nom' => 'Kits de premiers soins'])
            : $categories->random();

        return [
            'nom' => $this->generateKitName(),
            'description' => $this->generateKitDescription(),
            'categorie_id' => $categorie->id,
            'is_active' => $this->faker->boolean(90),
            'ref' => $this->faker->uuid,
            'created_by' => 1, // Admin par défaut
            'updated_by' => $this->faker->optional(70)->randomDigitNotNull,
        ];
    }

    protected function generateKitName(): string
    {
        $types = ['Premiers soins', 'Chirurgical', 'Obstétrique', 'Urgence', 'Trauma', 'Maternité'];
        $niveaux = ['Basique', 'Standard', 'Avancé', 'Professionnel', 'Complet'];

        return sprintf(
            'Kit %s %s %s',
            $this->faker->randomElement($types),
            $this->faker->randomElement($niveaux),
            $this->faker->randomElement(['RDC', 'Congo', 'Hôpital', 'Clinique'])
        );
    }

    protected function generateKitDescription(): string
    {
        $items = [
            'compresse stérile',
            'bandage élastique',
            'antiseptique',
            'gants stériles',
            'seringues',
            'médicaments essentiels',
            'matériel de suture',
            'thermomètre'
        ];

        $count = $this->faker->numberBetween(3, 8);
        $selectedItems = $this->faker->randomElements($items, $count);

        return "Kit contenant: " . implode(', ', $selectedItems) . ". " . 
               $this->faker->sentence(10);
    }

    // États supplémentaires
    public function premierSoins(): self
    {
        return $this->state([
            'nom' => 'Kit de Premiers Soins Standard RDC',
            'categorie_id' => Categorie::firstOrCreate(
                ['nom' => 'Kits de premiers soins'],
                ['description' => 'Kits pour soins médicaux de base']
            )->id
        ]);
    }

    public function chirurgical(): self
    {
        return $this->state([
            'nom' => 'Kit Chirurgical Avancé',
            'categorie_id' => Categorie::firstOrCreate(
                ['nom' => 'Kits chirurgicaux'],
                ['description' => 'Kits pour interventions chirurgicales']
            )->id
        ]);
    }

    public function inactif(): self
    {
        return $this->state([
            'is_active' => false
        ]);
    }
}