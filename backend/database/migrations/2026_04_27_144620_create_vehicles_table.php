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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('regNo')->unique();
            $table->string('type')->default('car');
            $table->string('brand');
            $table->string('model');
            $table->string('engine')->nullable();
            $table->date('purchaseDate')->nullable();
            $table->string('status')->default('available');
            $table->string('location')->nullable();
            $table->string('department')->nullable();
            $table->date('insuranceExpiry')->nullable();
            $table->date('roadTaxExpiry')->nullable();
            $table->string('class')->default('department');
            $table->unsignedBigInteger('odometer')->default(0);
            $table->string('fuelType')->nullable();
            $table->string('transmission')->nullable();
            $table->integer('year')->nullable();
            $table->string('vin')->nullable()->unique();
            $table->string('chassisNo')->nullable()->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
