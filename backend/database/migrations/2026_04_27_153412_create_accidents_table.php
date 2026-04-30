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
        Schema::create('accidents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicleId')->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('driverId')->constrained('drivers')->onDelete('cascade');
            $table->dateTime('date');
            $table->string('location')->nullable();
            $table->text('description')->nullable();
            $table->string('claimStatus')->default('pending');
            $table->integer('claimProgress')->default(0);
            $table->decimal('estimatedCost', 12, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};
