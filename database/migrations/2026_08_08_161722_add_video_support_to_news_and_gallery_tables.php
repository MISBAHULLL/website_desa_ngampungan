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
            $table->string('video_path')->nullable()->after('image_alt');
            $table->string('video_url')->nullable()->after('video_path');
        });

        Schema::table('gallery_photos', function (Blueprint $table) {
            $table->enum('media_type', ['photo', 'video'])->default('photo')->after('slug');
            $table->string('video_path')->nullable()->after('image_alt');
            $table->string('video_url')->nullable()->after('video_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news', function (Blueprint $table) {
            $table->dropColumn(['video_path', 'video_url']);
        });

        Schema::table('gallery_photos', function (Blueprint $table) {
            $table->dropColumn(['media_type', 'video_path', 'video_url']);
        });
    }
};
