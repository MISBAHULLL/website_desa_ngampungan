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
        Schema::create('service_application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_application_id');
            $table->string('status', 30);
            $table->text('public_notes')->nullable();
            $table->foreignId('changed_by')->nullable();
            $table->timestamps();

            $table->foreign(
                'service_application_id',
                'service_status_history_application_fk',
            )
                ->references('id')
                ->on('service_applications')
                ->cascadeOnDelete();
            $table->foreign('changed_by', 'service_status_history_user_fk')
                ->references('id')
                ->on('users')
                ->nullOnDelete();
            $table->index(
                ['service_application_id', 'created_at'],
                'service_status_history_timeline_idx',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_application_status_histories');
    }
};
