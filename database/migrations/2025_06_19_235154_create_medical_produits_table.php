<?php

use App\Models\Categorie;
use App\Models\Fournisseur;
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
        Schema::create('medical_produits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignIdFor(Categorie::class)->constrained()->cascadeOnDelete();
            $table->string('sous_category')->nullable();
            $table->string('unite');
            $table->text('description')->nullable();
            $table->string('fabrican')->nullable();
            $table->foreignIdFor(Fournisseur::class)->nullable()->constrained()->nullOnDelete();
            $table->boolean('requires_refrigeration')->default(false);
            $table->integer('duree_vie')->default(36);
            $table->integer('seuil_min')->default(0);
            $table->decimal('prix_unitaire', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->uuid('ref')->unique();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medical_produits');
    }
};
