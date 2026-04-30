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
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicleId')->constrained('vehicles')->onDelete('cascade');
            $table->string('type');
            $table->date('scheduledDate');
            $table->date('completedDate')->nullable();
            $table->unsignedBigInteger('odometerAt')->nullable();
            $table->unsignedBigInteger('nextServiceOdometer')->nullable();
            $table->string('vendor')->nullable();
            $table->string('status')->default('scheduled');
            $table->decimal('cost', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
