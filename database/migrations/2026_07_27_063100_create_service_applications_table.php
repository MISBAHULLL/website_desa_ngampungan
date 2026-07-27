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
        Schema::create('service_applications', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number', 32)->unique();
            $table->string('service_slug', 100)->index();
            $table->string('service_title', 150);
            $table->text('applicant_name');
            $table->text('national_id');
            $table->text('phone');
            $table->text('address');
            $table->text('purpose');
            $table->string('status', 30)->default('submitted');
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('submitted_at')->index();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_applications');
    }
};
