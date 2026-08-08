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
        Schema::create('village_potentials', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('category'); // 'umkm', 'agriculture', 'tourism', 'culture', 'culinary', 'services'
            $table->string('name');
            $table->string('image_path')->nullable();
            $table->string('image_alt')->nullable();
            $table->string('short_description', 500);
            $table->json('description');
            $table->string('manager_label');
            $table->string('manager_name');
            $table->string('address', 500);
            $table->string('phone');
            $table->string('phone_label')->nullable();
            $table->string('opening_hours', 500)->nullable();
            $table->json('tags')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('location_label', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('village_potentials');
    }
};
