<?php

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
        Schema::create('transferts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_hospital_id')->constrained('hopitals')->onDelete('cascade');
            $table->foreignId('to_hospital_id')->constrained('hopitals')->onDelete('cascade');
            $table->enum('status', ['en_attente', 'approuve', 'en_transit', 'livre', 'annule'])->default('en_attente');
            $table->enum('priorite', ['faible', 'moyen', 'eleve', 'urgent'])->default('moyen');
            $table->foreignId('demandeur_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approbateur_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestampTz('approuve_le')->nullable();
            $table->timestampTz('livre_le')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestampsTz();
            $table->uuid('ref')->unique();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transferts');
    }
};
