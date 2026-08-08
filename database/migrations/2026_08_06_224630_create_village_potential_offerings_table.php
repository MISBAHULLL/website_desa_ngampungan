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
        Schema::create('village_potential_offerings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('village_potential_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('description', 1000);
            $table->string('image_path')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('village_potential_offerings');
    }
};
