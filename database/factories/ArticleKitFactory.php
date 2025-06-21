<?php

namespace Database\Factories;

use App\Models\Kit;
use App\Models\MedicalProduit;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleKitFactory extends Factory
{
    public function definition(): array
    {
        $kit = Kit::inRandomOrder()->first() ?? Kit::factory()->create();
        $produit = MedicalProduit::inRandomOrder()->first() ?? MedicalProduit::factory()->create();

        return [
            'kit_id' => $kit->id,
            'medical_produit_id' => $produit->id,
            'quantite' => $this->generateRealisticQuantity($produit->unite),
            'ref' => $this->faker->uuid,
            'created_by' => 1, // Admin par défaut
            'updated_by' => $this->faker->optional(70)->randomDigitNotNull,
        ];
    }

    protected function generateRealisticQuantity(string $unite): int
    {
        return match($unite) {
            'comprimé', 'gélule' => $this->faker->numberBetween(5, 20),
            'boîte' => $this->faker->numberBetween(1, 3),
            'flacon', 'ampoule' => $this->faker->numberBetween(1, 5),
            'kit' => 1,
            default => $this->faker->numberBetween(1, 10)
        };
    }

    // États supplémentaires
    public function forKit(Kit $kit): self
    {
        return $this->state([
            'kit_id' => $kit->id
        ]);
    }

    public function forProduit(MedicalProduit $produit): self
    {
        return $this->state([
            'medical_produit_id' => $produit->id,
            'quantite' => $this->generateRealisticQuantity($produit->unite)
        ]);
    }
}