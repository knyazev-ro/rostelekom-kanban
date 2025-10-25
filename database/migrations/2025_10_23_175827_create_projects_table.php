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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->foreignId('segment_id')->nullable()->constrained('segments');
            $table->foreignId('manager_id')->constrained('users');
            $table->foreignId('payment_type_id')->nullable()->constrained('payment_types')->nullOnDelete();
            $table->foreignId('stage_id')->nullable()->constrained('stages')->nullOnDelete();
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->foreignId('eval_id')->nullable()->constrained('evaluations')->nullOnDelete();
            $table->date('date')->nullable();
            $table->string('client')->nullable();
            $table->string('project_number')->nullable();
            $table->timestamp('stage_changed_at')->nullable();
            $table->string('inn')->nullable();
            $table->boolean('is_industry_solution')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
