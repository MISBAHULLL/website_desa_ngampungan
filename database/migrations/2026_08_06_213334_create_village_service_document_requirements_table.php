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
        Schema::create('village_service_document_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('village_service_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('key', 100);
            $table->string('label', 150);
            $table->text('description')->nullable();
            $table->boolean('is_required')->default(true);
            $table->string('accepted_formats', 200)->default('.pdf,.jpg,.jpeg,.png');
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(
                ['village_service_id', 'key'],
                'village_service_doc_req_key_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('village_service_document_requirements');
    }
};
