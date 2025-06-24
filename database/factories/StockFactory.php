<?php

namespace Database\Factories;

use App\Models\Hopital;
use App\Models\MedicalProduit;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    public function definition(): array
    {
        $produit = MedicalProduit::inRandomOrder()->first() ?? MedicalProduit::factory()->create();
        $hopital = $this->faker->optional(70)->randomElement(Hopital::all());

        // Générer une date d'expiration cohérente avec la durée de vie du produit
        $dateExpiration = $this->faker->dateTimeBetween(
            'now', 
            '+'.$produit->duree_vie.' months'
        );

        return [
            'quantite' => $this->generateRealisticQuantity($produit->unite),
            'numero_lot' => $this->generateLotNumber(),
            'date_expiration' => $this->faker->boolean(90) ? $dateExpiration : null,
            'prix_unitaire' => $produit->prix_unitaire * $this->faker->randomFloat(1, 0.8, 1.2), // Variation de ±20%
            'received_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status' => $this->generateStatus($dateExpiration),
            'medical_produit_id' => $produit->id,
            'hopital_id' => $hopital?->id,
            'ref' => $this->faker->uuid,
            'created_by' => 1, // Admin par défaut
        ];
    }

    protected function generateRealisticQuantity(string $unite): int
    {
        // Quantités réalistes selon l'unité
        return match($unite) {
            'comprimé', 'gélule' => $this->faker->numberBetween(50, 1000),
            'boîte' => $this->faker->numberBetween(5, 100),
            'flacon', 'ampoule' => $this->faker->numberBetween(10, 200),
            'kit' => $this->faker->numberBetween(1, 20),
            default => $this->faker->numberBetween(1, 100)
        };
    }

    protected function generateLotNumber(): string
    {
        return strtoupper($this->faker->bothify('LOT-####-??-###'));
    }

    protected function generateStatus(?\DateTime $expirationDate): string
    {
        if (!$expirationDate || $this->faker->boolean(85)) {
            return 'disponible';
        }

        // 15% de chance d'avoir un statut autre que disponible
        $statuses = ['reservee', 'expirer', 'endommage'];
        $weights = [60, 30, 10]; // 60% réservé, 30% expiré, 10% endommagé

        return $this->faker->randomElement($statuses, $weights);
    }

    // États supplémentaires
    public function expiringSoon(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'date_expiration' => $this->faker->dateTimeBetween('now', '+1 month'),
                'status' => 'disponible'
            ];
        });
    }

    public function expired(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'date_expiration' => $this->faker->dateTimeBetween('-1 year', 'now'),
                'status' => 'expirer'
            ];
        });
    }

    public function reserved(): self
    {
        return $this->state([
            'status' => 'reservee'
        ]);
    }

    public function damaged(): self
    {
        return $this->state([
            'status' => 'endommage'
        ]);
    }

    public function forHopital(Hopital $hopital): self
    {
        return $this->state([
            'hopital_id' => $hopital->id
        ]);
    }
    public function forProduit(MedicalProduit $produit): self
    {
        return $this->state([
            'medical_produit_id' => $produit->id
        ]);
    }
}