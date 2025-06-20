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
        Schema::create('user_permissions', function (Blueprint $table) {
            $table->id();
                
                
                $table->foreignId('user_id')
                      ->nullable()
                      ->constrained('users')
                      ->nullOnDelete();
                
                $table->foreignId('permission_id')
                      ->nullable()
                      ->constrained()
                      ->cascadeOnDelete();
                
                $table->foreignId('granted_by')
                      ->nullable()
                      ->constrained('users')
                      ->nullOnDelete();
                
                $table->timestampTz('granted_at')->useCurrent();
            $table->uuid('ref')->unique();
            $table->timestampsTz();

            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_permissions');
    }
};
