<?php
use App\Models\Hopital;
use App\Models\MedicalProduit;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            
            $table->enum('type', ['stock_faible', 'avertissement_expiration', 'expire', 'demande_transfert', 'systeme'])
                  ->default('stock_faible');
            
            $table->enum('priorite', ['faible', 'moyen', 'eleve', 'critique'])
                  ->default('moyen');
            
            $table->string('titre');
            $table->text('message');
            $table->boolean('is_resolved')->default(false);
            
            // Clé étrangère pour l'hôpital
            $table->foreignId('hopital_id')
                  ->constrained('hopitals')
                  ->cascadeOnDelete();
            
            // Clé étrangère pour l'utilisateur qui a créé l'alerte
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            
            // Clé étrangère pour le produit médical
            $table->foreignId('medical_produit_id')
                  ->nullable()
                  ->constrained('medical_produits')
                  ->nullOnDelete();
            
            // Utilisateur qui a résolu l'alerte
            $table->foreignId('resolved_by')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();
            
            $table->timestampTz('resolved_at')->nullable();
            $table->uuid('ref')->unique();
            $table->timestampsTz();
            
            // Index pour améliorer les performances
            $table->index('type');
            $table->index('priorite');
            $table->index('is_resolved');
        });
    }

    public function down()
    {
        Schema::dropIfExists('alerts');
    }
};