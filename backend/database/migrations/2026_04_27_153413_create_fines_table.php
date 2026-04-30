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
        Schema::create('fines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicleId')->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('driverId')->constrained('drivers')->onDelete('cascade');
            $table->string('offence');
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->string('status')->default('unpaid');
            $table->string('ticketNo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fines');
    }
};
