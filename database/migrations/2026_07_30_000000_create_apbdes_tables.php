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
        Schema::create('apbdes_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('year', 4)->unique();
            $table->date('updated_date')->nullable();
            $table->bigInteger('net_financing')->default(0);
            $table->timestamps();
        });

        Schema::create('apbdes_income_sources', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apbdes_summary_id')->constrained('apbdes_summaries')->cascadeOnDelete();
            $table->string('code', 10);
            $table->string('label');
            $table->bigInteger('amount')->default(0);
            $table->string('description')->nullable();
            $table->timestamps();
        });

        Schema::create('apbdes_activity_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apbdes_summary_id')->constrained('apbdes_summaries')->cascadeOnDelete();
            $table->string('code', 20);
            $table->string('name');
            $table->enum('category', ['pemerintahan', 'pembangunan', 'pembinaan', 'pemberdayaan', 'darurat']);
            $table->bigInteger('budget')->default(0);
            $table->bigInteger('realized')->default(0);
            $table->string('location');
            $table->enum('status', ['selesai', 'berjalan', 'direncanakan'])->default('berjalan');
            $table->timestamps();
        });

        Schema::create('apbdes_documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('year', 4);
            $table->date('document_date');
            $table->string('file_path')->nullable();
            $table->string('file_size')->default('0 MB');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('apbdes_documents');
        Schema::dropIfExists('apbdes_activity_items');
        Schema::dropIfExists('apbdes_income_sources');
        Schema::dropIfExists('apbdes_summaries');
    }
};
