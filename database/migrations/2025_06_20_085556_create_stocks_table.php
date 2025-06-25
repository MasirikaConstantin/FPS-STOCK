<?php

use App\Models\Hopital;
use App\Models\MedicalProduit;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
           
            $table->integer('quantite')->default(0);
            $table->string('numero_lot')->nullable();
            $table->date('date_expiration')->nullable();
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->timestamp('received_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->enum('status', ['disponible', 'reservee', 'expirer', 'endommage'])->default('disponible');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignIdFor(MedicalProduit::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Hopital::class)->nullable()->constrained('hopitals')->nullOnDelete();
            $table->uuid('ref')->unique();
            $table->timestampsTz();

            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
