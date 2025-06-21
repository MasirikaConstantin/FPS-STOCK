<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Fournisseur;
use DragonCode\Support\Facades\Helpers\Arr;
use Illuminate\Database\Eloquent\Factories\Factory;

class MedicalProduitFactory extends Factory
{
    public function definition(): array
    {
        // Unités de mesure courantes
        $unites = ['boîte', 'flacon', 'comprimé', 'ampoule', 'sachet', 'tube', 'kit', 'paquet', 'mL', 'L', 'g', 'kg', 'unité'];

        // Sous-catégories possibles
        $sousCategories = [
            'Antibiotiques' => ['Pénicillines', 'Céphalosporines', 'Macrolides', 'Tétracyclines'],
            'Antipaludéens' => ['Combinés à base d\'artémisinine', 'Chloroquine', 'Quinine'],
            'Antidouleurs' => ['Paracétamol', 'Ibuprofène', 'Aspirine', 'Opioïdes'],
            'Matériel' => ['Chirurgical', 'Diagnostic', 'Protection', 'Injection']
        ];

        $categorie = Categorie::inRandomOrder()->first() ?? Categorie::factory()->create();
        $sousCategorie = $this->getSousCategorie($categorie->nom, $sousCategories);

        return [
            'name' => $this->generateProductName($categorie->nom),
            'categorie_id' => $categorie->id,
            'sous_category' => $sousCategorie,
            'unite' => $this->faker->randomElement($unites),
            'description' => $this->faker->paragraph,
            'fabrican' => $this->faker->company,
            'fournisseur_id' => Fournisseur::inRandomOrder()->first()?->id ?? Fournisseur::factory()->create()->id,
            'requires_refrigeration' => $this->faker->boolean(30),
            'duree_vie' => $this->faker->numberBetween(12, 60), // Entre 1 et 5 ans
            'seuil_min' => $this->faker->numberBetween(5, 100),
            'prix_unitaire' => $this->faker->randomFloat(2, 500, 50000), // Entre 500 et 50,000 CDF
            'is_active' => $this->faker->boolean(90),
            'ref' => $this->faker->uuid,
            'created_by' => 1, // Admin par défaut
        ];
    }

    protected function generateProductName(string $categorie): string
    {
        $prefixes = [
            'Med', 'Pharma', 'Bio', 'San', 'Care', 'Pro', 'Ultra', 'Super', 'Mega'
        ];

        $suffixes = [
            'plus', 'fort', 'active', 'guard', 'protect', 'life', 'cure', 'relief'
        ];

        $base = $this->faker->randomElement($prefixes) . $this->faker->randomElement($suffixes);

        // Ajout parfois du nom de la catégorie ou d'une spécificité
        if ($this->faker->boolean(60)) {
            $base .= ' ' . $this->faker->randomElement([$categorie, 'RDC', 'Congo', '500mg', '250mg', '10mL']);
        }

        return $base;
    }

    protected function getSousCategorie(string $categorie, array $sousCategories): ?string
    {
        foreach ($sousCategories as $cat => $subs) {
            if (str_contains($categorie, $cat)) {
                return $this->faker->randomElement($subs);
            }
        }
        return $this->faker->optional(60)->randomElement(Arr::flatten($sousCategories));
    }

    // États supplémentaires
    public function refrigerated(): self
    {
        return $this->state([
            'requires_refrigeration' => true,
            'duree_vie' => $this->faker->numberBetween(12, 24), // Durée plus courte pour les produits réfrigérés
        ]);
    }

    public function antibiotique(): self
    {
        return $this->state([
            'categorie_id' => Categorie::where('nom', 'like', '%Antibiotique%')->first()?->id 
                            ?? Categorie::factory()->create(['nom' => 'Antibiotiques'])->id,
            'sous_category' => $this->faker->randomElement(['Pénicillines', 'Céphalosporines', 'Macrolides']),
        ]);
    }

    public function antipaludeen(): self
    {
        return $this->state([
            'categorie_id' => Categorie::where('nom', 'like', '%Antipaludéen%')->first()?->id 
                            ?? Categorie::factory()->create(['nom' => 'Antipaludéens'])->id,
            'sous_category' => $this->faker->randomElement(['Combinés à base d\'artémisinine', 'Chloroquine']),
        ]);
    }

    public function materiel(): self
    {
        return $this->state([
            'categorie_id' => Categorie::where('nom', 'like', '%Matériel%')->first()?->id 
                            ?? Categorie::factory()->create(['nom' => 'Matériel médical'])->id,
            'unite' => $this->faker->randomElement(['unité', 'kit', 'paquet']),
            'requires_refrigeration' => false,
        ]);
    }
}