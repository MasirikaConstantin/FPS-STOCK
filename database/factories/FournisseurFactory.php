<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

class FournisseurFactory extends Factory
{
    public function definition(): array
    {
        $specialties = [
            'Médicaments génériques',
            'Dispositifs médicaux',
            'Équipements hospitaliers',
            'Produits pharmaceutiques',
            'Fournitures médicales',
            'Médicaments antipaludéens',
            'Antirétroviraux',
            'Vaccins',
            'Produits de diagnostic',
            'Matériel chirurgical',
            'Consommables médicaux'
        ];

        $companyTypes = ['SARL', 'SA', 'SCS', 'GIE', 'SNC', 'Entreprise Individuelle'];

        $nom = $this->generateCompanyName($companyTypes);

        return [
            'nom' => $nom,
            'contact_person' => $this->faker->name,
            'phone' => $this->generateCongolesePhoneNumber(),
            'email' => $this->generateCompanyEmail($nom),
            'address' => $this->faker->address,
            'specialties' => $this->generateSpecialties($specialties), // Format corrigé
            'is_active' => $this->faker->boolean(85),
            'contract_start_date' => $this->faker->dateTimeBetween('-5 years', 'now'),
            'contract_end_date' => $this->faker->optional(70)->dateTimeBetween('now', '+3 years'),
            'ref' => $this->faker->uuid,
            'created_by' => 1,
        ];
    }
    protected function generateCompanyName(array $companyTypes): string
    {
        $prefixes = [
            'Pharma', 'Medi', 'Bio', 'Health', 'Care', 'Med', 'Pharm', 
            'Labo', 'Pharco', 'San', 'Clin', 'Hospi', 'Servi'
        ];

        $suffixes = [
            'tech', 'plus', 'group', 'international', 'RDC', 'Congo',
            'services', 'distrib', 'santé', 'medical', 'pharma', 'care'
        ];

        $name = $this->faker->randomElement($prefixes) . $this->faker->randomElement($suffixes);
        $type = $this->faker->randomElement($companyTypes);

        return "{$name} {$type}";
    }

    protected function generateCongolesePhoneNumber(): string
    {
        $prefixes = ['+24381', '+24382', '+24384', '+24389', '+24397', '+24390', '+24399'];
        $number = $this->faker->numerify('########');
        
        return $this->faker->randomElement($prefixes) . $number;
    }

    protected function generateCompanyEmail(string $companyName): string
    {
        $domain = strtolower(str_replace(' ', '', $companyName));
        $tlds = ['.com', '.cd', '.net', '.org', '.info'];
        
        return 'contact@' . $domain . $this->faker->randomElement($tlds);
    }

    protected function generateSpecialties(array $specialties): array
    {
        $count = $this->faker->numberBetween(1, 3);
        return $this->faker->randomElements($specialties, $count);
    }

    // Modifier les états pour retourner des tableaux directement
    public function medicaments(): self
    {
        return $this->state([
            'specialties' => ['Médicaments génériques', 'Produits pharmaceutiques'],
        ]);
    }

    public function equipements(): self
    {
        return $this->state([
            'specialties' => ['Équipements hospitaliers', 'Dispositifs médicaux'],
        ]);
    }

    public function antipaludeens(): self
    {
        return $this->state([
            'specialties' => ['Médicaments antipaludéens'],
            'nom' => $this->faker->randomElement(['PaludPharm', 'AntiPal RDC', 'MalariaStop']) . ' SARL',
        ]);
    }
}