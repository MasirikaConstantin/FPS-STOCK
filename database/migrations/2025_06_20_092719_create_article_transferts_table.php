<?php

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
        Schema::create('article_transferts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transfert_id')->constrained()->onDelete('cascade');
            $table->foreignId('medical_produit_id')->constrained()->onDelete('cascade');
            $table->foreignId('stock_source_id')->nullable()->constrained('stocks')->onDelete('cascade');
            $table->boolean('from_central')->default(false);
            $table->integer('quantite')->unsigned();
            $table->enum('status', ['en_attente', 'preleve', 'livre', 'annule'])->default('en_attente');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('ref')->unique();
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_transferts');
    }
};
