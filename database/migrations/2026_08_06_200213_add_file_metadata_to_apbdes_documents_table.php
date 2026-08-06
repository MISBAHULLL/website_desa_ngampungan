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
        Schema::table('apbdes_documents', function (Blueprint $table) {
            $table->string('file_format', 10)->default('PDF')->after('file_path');
            $table->string('original_name')->nullable()->after('file_format');
            $table->string('mime_type', 100)->nullable()->after('original_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('apbdes_documents', function (Blueprint $table) {
            $table->dropColumn(['file_format', 'original_name', 'mime_type']);
        });
    }
};
