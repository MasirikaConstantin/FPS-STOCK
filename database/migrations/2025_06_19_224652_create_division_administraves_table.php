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
        Schema::create('division_administraves', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('type', ['province', 'territoire', 'ville','commune']);
            $table->string('code')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestampsTz();
            $table->uuid('ref')->unique();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('division_administraves')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('division_administraves');
    }
};
