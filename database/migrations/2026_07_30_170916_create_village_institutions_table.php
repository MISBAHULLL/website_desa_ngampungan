<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('village_institutions', function (Blueprint $table) {
            $table->id();
            $table->string('acronym', 10);
            $table->string('name');
            $table->string('leader')->nullable();
            $table->unsignedInteger('member_count')->default(0);
            $table->text('focus');
            $table->json('responsibilities');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('village_institutions');
    }
};
