<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('village_institutions', function (Blueprint $table) {
            $table->string('logo_path')->nullable()->after('acronym');
            $table->text('description')->nullable()->after('focus');
            $table->json('members')->nullable()->after('responsibilities');
        });
    }

    public function down(): void
    {
        Schema::table('village_institutions', function (Blueprint $table) {
            $table->dropColumn(['logo_path', 'description', 'members']);
        });
    }
};
