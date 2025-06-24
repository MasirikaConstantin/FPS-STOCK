<?php
namespace Database\Factories;

use App\Models\Hopital;
use App\Models\MedicalProduit;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlertFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'type' => $this->faker->randomElement([
                'stock_faible',
                'avertissement_expiration',
                'expire',
                'demande_transfert',
                'systeme'
            ]),
            'priorite' => $this->faker->randomElement(['faible', 'moyen', 'eleve', 'critique']),
            'titre' => $this->faker->sentence,
            'message' => $this->faker->paragraph,
            'is_resolved' => false,
            'hopital_id' => Hopital::factory(),
            'user_id' => User::factory(),
            'medical_produit_id' => MedicalProduit::factory(),
            'resolved_by' => null,
            'resolved_at' => null,
            'ref' => $this->faker->uuid,
        ];
    }

    /**
     * Configure l'alerte pour un produit spécifique
     */
    public function forProduit(MedicalProduit $produit)
    {
        return $this->state([
            'medical_produit_id' => $produit->id,
        ]);
    }

    /**
     * Configure l'alerte pour un type spécifique
     */
    public function ofType(string $type)
    {
        return $this->state([
            'type' => $type,
        ]);
    }

    /**
     * Alerte résolue
     */
    public function resolved()
    {
        return $this->state([
            'is_resolved' => true,
            'resolved_by' => User::factory(),
            'resolved_at' => now(),
        ]);
    }

    /**
     * Alerte de stock faible
     */
    public function stockFaible()
    {
        return $this->ofType('stock_faible')
            ->state([
                'titre' => 'Stock faible pour un produit',
                'message' => 'Le stock est en dessous du seuil minimum pour ce produit',
                'priorite' => 'eleve',
            ]);
    }

    /**
     * Alerte d'expiration
     */
    public function avertissementExpiration()
    {
        return $this->ofType('avertissement_expiration')
            ->state([
                'titre' => 'Produit proche de expiration',
                'message' => 'Ce produit approche de sa date de péremption',
                'priorite' => 'moyen',
            ]);
    }

    /**
     * Alerte de produit expiré
     */
    public function expire()
    {
        return $this->ofType('expire')
            ->state([
                'titre' => 'Produit expiré',
                'message' => 'Ce produit a dépassé sa date de péremption',
                'priorite' => 'critique',
            ]);
    }
    public function demande_transfert(){
        return $this->ofType('demande_transfert')
        ->state([
            'titre' =>'Demande de transfert',
            'message' =>"Demande de transfert chez nous",
            'priorite'=>'critique'
        ]);
    }
}