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
        Schema::create('village_services', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('title', 150);
            $table->text('short_description');
            $table->string('category', 30)->index();
            $table->string('audience', 150);
            $table->string('channel', 150);
            $table->string('estimated_duration', 100);
            $table->string('fee', 50)->default('Gratis');
            $table->string('service_contact', 150)->nullable();
            $table->string('service_hours', 150)->nullable();
            $table->json('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('village_services');
    }
};
