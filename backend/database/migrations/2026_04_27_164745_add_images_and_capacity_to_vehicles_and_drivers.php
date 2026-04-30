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
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('chassisNo');
            $table->string('capacity')->nullable()->after('image_path');
            $table->string('load')->nullable()->after('capacity');
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('accidentCount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'capacity', 'load']);
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
