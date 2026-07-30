<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('village_profiles', function (Blueprint $table) {
            $table->id();

            // Core statistics
            $table->unsignedInteger('total_population')->nullable();
            $table->unsignedInteger('total_families')->nullable();
            $table->unsignedInteger('total_hamlets')->nullable();
            $table->unsignedInteger('total_area_hectares')->nullable();

            // Administrative boundaries
            $table->string('boundary_north')->nullable();
            $table->string('boundary_east')->nullable();
            $table->string('boundary_south')->nullable();
            $table->string('boundary_west')->nullable();

            // Structured JSON data
            $table->json('hamlets')->nullable();
            $table->json('land_use')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('village_profiles');
    }
};
