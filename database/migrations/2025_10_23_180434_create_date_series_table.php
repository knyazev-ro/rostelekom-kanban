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
        Schema::create('date_series', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects');
            $table->unsignedBigInteger('year');

            $table->json('january')->nullable();
            $table->json('february')->nullable();
            $table->json('march')->nullable();
            $table->json('april')->nullable();
            $table->json('may')->nullable();
            $table->json('june')->nullable();
            $table->json('july')->nullable();
            $table->json('august')->nullable();
            $table->json('september')->nullable();
            $table->json('october')->nullable();
            $table->json('november')->nullable();
            $table->json('december')->nullable();

            $table->double('total');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('date_series');
    }
};
