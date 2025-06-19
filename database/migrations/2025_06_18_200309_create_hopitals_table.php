<?php

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
        Schema::create('hopitals', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->enum('type', ['central', 'general', 'reference', 'centre_sante'])->nullable();
            $table->string('province');
            $table->string('ville');
            $table->text('adresse')->nullable();
            $table->string('contact')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->integer('capacite')->default(0);
            $table->boolean('est_actif')->default(true);
            $table->jsonb('coordonnees')->nullable();
            $table->uuid('ref')->primary()->default(DB::raw('gen_random_uuid()'));

            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hopitals');
    }
};
