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
        Schema::create('service_application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_application_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('document_key', 100);
            $table->string('document_label', 150);
            $table->text('original_name');
            $table->string('storage_disk', 30)->default('local');
            $table->string('storage_path', 500);
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('size');
            $table->timestamps();

            $table->unique([
                'service_application_id',
                'document_key',
            ], 'service_application_document_key_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_application_documents');
    }
};
