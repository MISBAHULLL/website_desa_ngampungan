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
        Schema::create('village_leaders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position')->default('Kepala Desa');
            $table->string('photo')->nullable();
            $table->text('welcome_message');
            $table->text('vision')->nullable();
            $table->text('mission')->nullable();
            $table->date('started_at');
            $table->date('ended_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('village_leaders');
    }
};
