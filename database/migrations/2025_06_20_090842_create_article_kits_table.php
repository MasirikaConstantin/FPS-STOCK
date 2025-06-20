<?php

use App\Models\Kit;
use App\Models\MedicalProduit;
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
        Schema::create('article_kits', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Kit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(MedicalProduit::class)->constrained()->cascadeOnDelete();
            $table->integer('quantite')->default(1);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->uuid('ref')->unique();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_kits');
    }
};
