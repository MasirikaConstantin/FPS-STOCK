<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up()
    {
        Schema::create('rapports', function (Blueprint $table) {
            // Identifiant unique
            $table->id();
            
            // Type de rapport
            $table->enum('type', [
                'consommation_mensuelle', 
                'rapport_expiration', 
                'resume_transfert',
                'evaluation_stock'
            ])->comment('Type de rapport généré');
            
            // Référence à l'hôpital concerné
            $table->foreignId('hopital_id')
                  ->nullable()
                  ->constrained('hopitals')
                  ->onDelete('set null')
                  ->comment('Hôpital concerné par le rapport');
            
            // Période couverte (début et fin)
            $table->json('periode')
                  ->comment('Période couverte par le rapport (dates début/fin)');
            
            // Utilisateur ayant généré le rapport
            $table->foreignId('genere_par')
                  ->constrained('profils')
                  ->comment('Utilisateur ayant généré le rapport');
            
            
            // Statut de génération
            $table->enum('statut', [
                'en_cours', 
                'pret', 
                'erreur'
            ])->default('en_cours')
              ->comment('Statut de génération du rapport');
            
            // Chemin du fichier (optionnel)
            $table->string('chemin_fichier', 255)
                  ->nullable()
                  ->comment('Chemin d\'accès au fichier PDF/Excel généré');
            
            // Timestamps
            $table->timestampTz('genere_le')
                  ->useCurrent()
                  ->comment('Date de génération du rapport');
            
            $table->timestampTz('mis_a_jour_le')
                  ->nullable()
                  ->comment('Date de dernière mise à jour');
                  $table->uuid('ref')->unique();
            
            // Index pour améliorer les performances
            $table->index('type');
            $table->index('statut');
            $table->index('genere_le');
        });
    }

    public function down()
    {
        Schema::dropIfExists('rapports');
    }
};