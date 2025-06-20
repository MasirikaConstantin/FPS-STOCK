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
            $table->foreignId('source_location_id')->constrained("hopitals")->onDelete('cascade');
            $table->foreignId('destination_location_id')->constrained('hopitals')->onDelete('cascade');
            $table->integer('quantite')->unsigned();
            $table->foreignIdFor(MedicalProduit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Transfert::class)->constrained()->cascadeOnDelete();
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
