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
        Schema::table('news', function (Blueprint $table) {
            $table->index(['published_at', 'id'], 'news_homepage_published_index');
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->index(['status', 'ends_at'], 'announcements_active_period_index');
            $table->index(['is_pinned', 'starts_at', 'id'], 'announcements_homepage_order_index');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->index(['is_active', 'order', 'id'], 'hero_slides_homepage_index');
        });

        Schema::table('village_leaders', function (Blueprint $table) {
            $table->index(['is_active', 'started_at'], 'village_leaders_active_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropIndex('news_homepage_published_index');
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->dropIndex('announcements_active_period_index');
            $table->dropIndex('announcements_homepage_order_index');
        });

        Schema::table('hero_slides', function (Blueprint $table) {
            $table->dropIndex('hero_slides_homepage_index');
        });

        Schema::table('village_leaders', function (Blueprint $table) {
            $table->dropIndex('village_leaders_active_index');
        });
    }
};
