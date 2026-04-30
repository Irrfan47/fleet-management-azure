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
            $table->string('insurance_provider')->nullable()->after('insurance_policy_no');
            $table->string('road_tax_ref')->nullable()->after('roadTaxExpiry');
            $table->string('insurance_doc_path')->nullable()->after('insurance_provider');
            $table->string('road_tax_doc_path')->nullable()->after('road_tax_ref');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['insurance_provider', 'road_tax_ref', 'insurance_doc_path', 'road_tax_doc_path']);
        });
    }
};
