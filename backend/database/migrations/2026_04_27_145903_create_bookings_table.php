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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicleId')->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('driverId')->constrained('drivers')->onDelete('cascade');
            $table->dateTime('startDate');
            $table->dateTime('endDate');
            $table->string('purpose');
            $table->string('status')->default('pending');
            $table->string('destination')->nullable();
            $table->unsignedBigInteger('odometerStart')->nullable();
            $table->unsignedBigInteger('odometerEnd')->nullable();
            $table->dateTime('checkInAt')->nullable();
            $table->dateTime('checkOutAt')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
