<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agendas', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Pelayanan');
            $table->text('summary');
            $table->json('details')->nullable();
            $table->date('event_date');
            $table->string('day_label');
            $table->string('date_label');
            $table->string('time_label');
            $table->string('location');
            $table->string('organizer')->default('Pemerintah Desa Ngampungan');
            $table->string('contact')->nullable();
            $table->boolean('registration_required')->default(false);
            $table->string('status')->default('upcoming'); // upcoming, completed
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agendas');
    }
};
