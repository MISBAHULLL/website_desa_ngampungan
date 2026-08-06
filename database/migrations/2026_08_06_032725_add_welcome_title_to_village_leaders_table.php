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
        Schema::table('village_leaders', function (Blueprint $table) {
            $table->string('welcome_title')
                ->nullable()
                ->after('photo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('village_leaders', function (Blueprint $table) {
            $table->dropColumn('welcome_title');
        });
    }
};
