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
        Schema::create('profils', function (Blueprint $table) {
            $table->id('id');
            $table->uuid('hospital_id')->nullable();
            $table->uuid('user_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->foreign('user_id')->references('id')->on('users');

            $table->foreign('hospital_id')->references('id')->on('hopitals');
            $table->uuid('ref')->primary()->default(DB::raw('gen_random_uuid()'));

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profils');
    }
};
