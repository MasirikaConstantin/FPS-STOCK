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
                $table->foreignId('from_hospital_id')->constrained('hopitals');
                $table->foreignId('to_hospital_id')->constrained('hopitals');
                $table->enum('status', ['en attente', 'approuvé', 'en transit', 'livré', 'annulé'])->default('en attente');
                $table->enum('priorité', ['faible', 'moyen', 'élevé', 'urgent'])->default('moyen');
                $table->foreignId('demander_par')->nullable()->constrained('users')->nullOnDelete();
                $table->foreignId('approuver_par')->nullable()->constrained('users')->nullOnDelete();
                $table->text('notes')->nullable();
                $table->timestampTz('approuver__le')->nullable();
                $table->timestampTz('delivrer_le')->nullable();
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
