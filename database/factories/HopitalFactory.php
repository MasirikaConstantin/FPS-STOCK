<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class HopitalFactory extends Factory
{
    public function definition(): array
    {
        $provinces = [
            'Kinshasa', 'Kongo-Central', 'Kwango', 'Kwilu', 'Mai-Ndombe',
            'Kasai', 'Kasai-Central', 'Kasai-Oriental', 'Lomami', 'Sankuru',
            'Maniema', 'Sud-Kivu', 'Nord-Kivu', 'Ituri', 'Haut-Uele',
            'Tshopo', 'Bas-Uele', 'Nord-Ubangi', 'Mongala', 'Sud-Ubangi',
            'Equateur', 'Tshuapa'
        ];

        $types = ['central', 'general', 'reference', 'centre_sante'];

        $villes = [
            'Kinshasa' => ['Kinshasa', 'Ngaliema', 'Gombe', 'Lingwala'],
            'Nord-Kivu' => ['Goma', 'Beni', 'Butembo', 'Rutshuru'],
            'Sud-Kivu' => ['Bukavu', 'Uvira', 'Baraka', 'Kamituga'],
            'Kongo-Central' => ['Matadi', 'Boma', 'Muanda', 'Songololo'],
            'Haut-Katanga' => ['Lubumbashi', 'Likasi', 'Kipushi', 'Kambove']
        ];

        $province = $this->faker->randomElement($provinces);
        $ville = Arr::get($villes, $province, [$province]);
        $ville = is_array($ville) ? $this->faker->randomElement($ville) : $ville;

        return [
            'nom' => $this->generateHospitalName($province, $ville),
            'type' => $this->faker->randomElement($types),
            'province' => $province,
            'ville' => $ville,
            'address' => $this->faker->address,
            'contact_person' => $this->faker->name,
            'phone' => $this->faker->phoneNumber,
            'email' => $this->faker->companyEmail,
            'capacite' => $this->faker->numberBetween(50, 500),
            'is_active' => $this->faker->boolean(90),
            'coordonees' => json_encode([ // Conversion explicite en JSON
                'latitude' => $this->faker->latitude,
                'longitude' => $this->faker->longitude
            ]),
            'ref' => $this->faker->uuid,
            'division_administrative_id' => null,
            'created_by' => 1,
            //'updated_by' => $this->faker->optional(70, null)->randomDigitNotNull,
        ];
    }

    protected function generateHospitalName(string $province, string $ville): string
    {
        $prefixes = ['Hôpital', 'Clinique', 'Centre Médical', 'Hôpital Général', 'Centre de Santé'];
        $suffixes = [
            'de Référence', 'Provincial', 'Régional', 'Universitaire', 
            'Spécialisé', 'Moderne', 'Mère-Enfant', 'du Cinquantenaire'
        ];

        $base = $this->faker->randomElement($prefixes);
        
        if ($this->faker->boolean(60)) {
            $base .= ' ' . $this->faker->randomElement($suffixes);
        }
        
        if ($this->faker->boolean(40)) {
            $base .= ' ' . $this->faker->randomElement([$ville, $province]);
        }

        return $base;
    }
    // États pour les différents types d'hôpitaux
    public function central(): self
    {
        return $this->state([
            'type' => 'central',
            'capacite' => $this->faker->numberBetween(300, 1000),
        ]);
    }

    public function general(): self
    {
        return $this->state([
            'type' => 'general',
            'capacite' => $this->faker->numberBetween(150, 400),
        ]);
    }

    public function reference(): self
    {
        return $this->state([
            'type' => 'reference',
            'capacite' => $this->faker->numberBetween(200, 600),
        ]);
    }

    public function centreSante(): self
    {
        return $this->state([
            'type' => 'centre_sante',
            'capacite' => $this->faker->numberBetween(20, 100),
        ]);
    }

    // Méthode pour configurer la relation avec division administrative
    public function configure()
    {
        return $this->afterCreating(function ($hopital) {
            // Trouver une division administrative correspondant à la province/ville
            $division = \App\Models\DivisionAdministrative::query()
                ->where('nom', 'like', "%{$hopital->ville}%")
                ->orWhere('nom', 'like', "%{$hopital->province}%")
                ->first();
            
            if ($division) {
                $hopital->update(['division_administrative_id' => $division->id]);
            }
        });
    }
}