<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DivisionAdministrativeFactory extends Factory
{
    public function definition(): array
    {
        // Types possibles
        $types = ['province', 'territoire', 'ville', 'commune'];
        $type = $this->faker->randomElement($types);
        
        // Génération du nom selon le type
        $nom = match($type) {
            'province' => 'Kinshasa',
            'ville' => 'Ville de Kinshasa',
            'commune' => $this->faker->randomElement([
                'Kinshasa', 'Lingwala', 'Kalamu', 'Ngaliema', 'Bandalungwa', 
                'Barumbu', 'Gombe', 'Kasa-Vubu', 'Kimbanseke', 'Kintambo',
                'Kisenso', 'Lemba', 'Limete', 'Makala', 'Maluku',
                'Masina', 'Matete', 'Mont-Ngafula', 'Ndjili', 'Ngaba',
                'Ngiri-Ngiri', 'Nsele', 'Selembao'
            ]),
            default => $this->faker->city
        };
        
        // Génération du code selon le type
        $code = match($type) {
            'province' => 'KN',
            'ville' => 'KN-V',
            'commune' => 'KN-C-' . strtoupper(substr($nom, 0, 3)),
            default => strtoupper($this->faker->bothify('??-##'))
        };

        return [
            'nom' => $nom,
            'type' => $type,
            'code' => $code,
            'is_active' => $this->faker->boolean(90),
            'ref' => $this->faker->uuid,
            'created_by' => null, // À remplacer par un ID utilisateur si nécessaire
            'parent_id' => null, // À gérer selon la hiérarchie
        ];
    }

    // États supplémentaires pour les différents types
    public function province(): self
    {
        return $this->state([
            'type' => 'province',
            'nom' => 'Kinshasa',
            'code' => 'KN',
        ]);
    }

    public function ville(): self
    {
        return $this->state([
            'type' => 'ville',
            'nom' => 'Ville de Kinshasa',
            'code' => 'KN-V',
        ]);
    }

    public function commune(): self
    {
        return $this->state([
            'type' => 'commune',
            'nom' => $this->faker->randomElement([
                'Kinshasa', 'Lingwala', 'Kalamu', 'Ngaliema', 'Bandalungwa', 
                'Barumbu', 'Gombe', 'Kasa-Vubu', 'Kimbanseke', 'Kintambo',
                'Kisenso', 'Lemba', 'Limete', 'Makala', 'Maluku',
                'Masina', 'Matete', 'Mont-Ngafula', 'Ndjili', 'Ngaba',
                'Ngiri-Ngiri', 'Nsele', 'Selembao'
            ]),
        ]);
    }

    public function territoire(): self
    {
        return $this->state([
            'type' => 'territoire',
            'nom' => $this->faker->city,
        ]);
    }
}