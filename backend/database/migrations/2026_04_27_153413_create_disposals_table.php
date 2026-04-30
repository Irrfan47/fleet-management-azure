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
        Schema::create('disposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicleId')->constrained('vehicles')->onDelete('cascade');
            $table->text('reason');
            $table->string('method');
            $table->decimal('evaluationValue', 12, 2)->nullable();
            $table->decimal('finalValue', 12, 2)->nullable();
            $table->string('status')->default('pending');
            $table->string('approvedBy')->nullable();
            $table->dateTime('executedAt')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disposals');
    }
};
