<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('village_officials', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('initials', 5);
            $table->string('position');
            $table->string('unit');
            $table->string('group'); // leadership, secretariat, technical, territorial
            $table->string('photo_path')->nullable();
            $table->string('term')->nullable();
            $table->string('employee_id')->nullable();
            $table->text('summary');
            $table->text('about')->nullable();
            $table->json('responsibilities');
            $table->json('service_focus');
            $table->json('education');
            $table->json('career');
            $table->unsignedInteger('sort_order')->default(0);
            $table->foreignId('parent_id')->nullable()->constrained('village_officials')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('village_officials');
    }
};
