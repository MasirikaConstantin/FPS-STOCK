<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategorieFactory extends Factory
{
    public function definition(): array
    {
        // Catégories médicales courantes en RDC
        $medicalCategories = [
            'Médicaments',
            'Dispositifs médicaux',
            'Équipements hospitaliers',
            'Produits de diagnostic',
            'Fournitures médicales',
            'Produits d\'hygiène',
            'Matériel chirurgical',
            'Produits vétérinaires'
        ];

        // Sous-catégories spécifiques
        $subCategories = [
            'Anti-inflammatoires',
            'Antibiotiques',
            'Antalgiques',
            'Antipaludéens',
            'Antirétroviraux',
            'Lits médicaux',
            'Fauteuils roulants',
            'Béquilles',
            'Déambulateurs',
            'Matériel de pansement',
            'Seringues et aiguilles',
            'Gants médicaux',
            'Masques de protection',
            'Thermomètres',
            'Tensiomètres',
            'Oxymètres',
            'Stéthoscopes',
            'Kits de premiers soins'
        ];

        // On combine parfois les catégories et sous-catégories pour plus de variété
        $nom = $this->faker->randomElement([
            $this->faker->randomElement($medicalCategories),
            $this->faker->randomElement($medicalCategories).' - '.$this->faker->randomElement($subCategories),
            $this->faker->randomElement($subCategories)
        ]);

        return [
            'nom' => $nom,
            'description' => $this->faker->paragraph,
            'is_active' => $this->faker->boolean(90),
            'ref' => $this->faker->unique()->uuid,
            'created_by' => 1, // Fixé à 1 comme demandé
            //'updated_by' => $this->faker->optional(70, null)->randomDigitNotNull,
        ];
    }

    // États supplémentaires pour des catégories spécifiques
    public function medicaments(): self
    {
        return $this->state([
            'nom' => 'Médicaments',
            'description' => 'Produits pharmaceutiques pour le traitement des maladies',
        ]);
    }

    public function antiInflammatoires(): self
    {
        return $this->state([
            'nom' => 'Anti-inflammatoires',
            'description' => 'Médicaments pour réduire l\'inflammation et la douleur',
        ]);
    }

    public function litsMedicaux(): self
    {
        return $this->state([
            'nom' => 'Lits médicaux',
            'description' => 'Lits spécialisés pour les établissements de santé',
        ]);
    }

    public function materielChirurgical(): self
    {
        return $this->state([
            'nom' => 'Matériel chirurgical',
            'description' => 'Instruments et équipements pour les interventions chirurgicales',
        ]);
    }
}