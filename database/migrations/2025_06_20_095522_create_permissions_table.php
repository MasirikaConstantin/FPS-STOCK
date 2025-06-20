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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
                $table->string('name', 100)->unique()->comment('Nom unique de la permission');
                $table->text('description')->nullable()->comment('Description détaillée de la permission');
                $table->string('module', 50)->index()->comment('Module concerné par la permission');
                $table->string('action', 50)->index()->comment('Action autorisée par la permission');
                $table->timestampsTz();
                
            $table->uuid('ref')->unique();
                // Index composites pour les recherches fréquentes
                $table->index(['module', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
