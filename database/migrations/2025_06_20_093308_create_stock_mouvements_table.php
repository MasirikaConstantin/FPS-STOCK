<?php

use App\Models\Hopital;
use App\Models\MedicalProduit;
use App\Models\Transfert;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_mouvements', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['entree', 'sortie', 'transfert', 'ajustement'])
                  ->default('entree')
                  ->comment('Type de mouvement: entrée, sortie, transfert ou ajustement');
            
            $table->unsignedInteger('quantite')
                  ->comment('Quantité déplacée, toujours positive');
            
            $table->text('raison')->nullable()
                  ->comment('Raison du mouvement (commande, consommation, etc.)');
            
            $table->text('notes')->nullable()
                  ->comment('Informations supplémentaires sur le mouvement');
            
            // Référence au produit médical
            $table->foreignIdFor(MedicalProduit::class)
                  ->constrained()
                  ->cascadeOnDelete()
                  ->comment('Produit concerné par le mouvement');
            
            // Référence à l'hôpital (source ou destination)
            $table->foreignIdFor(Hopital::class)
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete()
                  ->comment('Hôpital concerné par le mouvement');
            
            // Utilisateur qui a effectué le mouvement
            $table->foreignId('created_by')
                  ->constrained('users')
                  ->comment('Utilisateur responsable du mouvement');
                  $table->foreignId('updated_by')
                  ->constrained('users')
                  ->comment('Utilisateur responsable du mouvement');
            
            // Référence au transfert si c'est un mouvement de type transfert
            $table->foreignIdFor(Transfert::class)
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete()
                  ->comment('Lien vers le transfert si applicable');
            
            $table->uuid('ref')->unique()
                  ->comment('Référence unique du mouvement');
            
            // Dates de création et mise à jour avec timezone
            $table->timestampsTz();
            
            // Index pour améliorer les performances
            $table->index('type');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_mouvements');
    }
};
