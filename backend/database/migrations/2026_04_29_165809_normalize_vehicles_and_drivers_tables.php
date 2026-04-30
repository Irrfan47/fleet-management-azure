<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Data Preservation: Transfer data to relational tables
        $vehicles = DB::table('vehicles')->get();

        foreach ($vehicles as $v) {
            // Insurance Policy Sync
            if (!empty($v->insuranceExpiry) || !empty($v->insurance_policy_no)) {
                $exists = DB::table('insurance_policies')
                    ->where('vehicleId', $v->id)
                    ->where('type', 'insurance')
                    ->exists();

                if (!$exists) {
                    DB::table('insurance_policies')->insert([
                        'vehicleId' => $v->id,
                        'type' => 'insurance',
                        'policyNo' => $v->insurance_policy_no ?? 'TBA',
                        'provider' => $v->insurance_provider ?? 'TBA',
                        'startDate' => now()->subYear()->format('Y-m-d'),
                        'expiryDate' => $v->insuranceExpiry,
                        'premium' => 0,
                        'document_path' => $v->insurance_doc_path ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Road Tax Sync
            if (!empty($v->roadTaxExpiry) || !empty($v->road_tax_ref)) {
                $exists = DB::table('insurance_policies')
                    ->where('vehicleId', $v->id)
                    ->where('type', 'road_tax')
                    ->exists();

                if (!$exists) {
                    DB::table('insurance_policies')->insert([
                        'vehicleId' => $v->id,
                        'type' => 'road_tax',
                        'policyNo' => $v->road_tax_ref ?? ('ROADTAX-' . $v->regNo),
                        'provider' => 'JPJ',
                        'startDate' => now()->subYear()->format('Y-m-d'),
                        'expiryDate' => $v->roadTaxExpiry,
                        'premium' => 0,
                        'document_path' => $v->road_tax_doc_path ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Maintenance Sync
            if (!empty($v->next_service_date) || !empty($v->next_service_odometer)) {
                $exists = DB::table('maintenances')
                    ->where('vehicleId', $v->id)
                    ->where('status', 'scheduled')
                    ->exists();

                if (!$exists) {
                    DB::table('maintenances')->insert([
                        'vehicleId' => $v->id,
                        'type' => 'service',
                        'scheduledDate' => $v->next_service_date ?? now()->addMonth()->format('Y-m-d'),
                        'nextServiceOdometer' => $v->next_service_odometer ?? ($v->odometer + 5000),
                        'status' => 'scheduled',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // 2. Schema Normalization: Drop columns
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn([
                'insuranceExpiry',
                'roadTaxExpiry',
                'road_tax_ref',
                'road_tax_doc_path',
                'insurance_policy_no',
                'insurance_provider',
                'insurance_doc_path',
                'next_service_date',
                'next_service_odometer'
            ]);
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn(['fineCount', 'accidentCount']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Restore columns
        Schema::table('vehicles', function (Blueprint $table) {
            $table->date('insuranceExpiry')->nullable();
            $table->date('roadTaxExpiry')->nullable();
            $table->string('road_tax_ref')->nullable();
            $table->string('road_tax_doc_path')->nullable();
            $table->string('insurance_policy_no')->nullable();
            $table->string('insurance_provider')->nullable();
            $table->string('insurance_doc_path')->nullable();
            $table->date('next_service_date')->nullable();
            $table->integer('next_service_odometer')->nullable();
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->integer('fineCount')->default(0);
            $table->integer('accidentCount')->default(0);
        });

        // 2. Repopulate data
        $vehicles = DB::table('vehicles')->get();
        foreach ($vehicles as $v) {
            $latestIns = DB::table('insurance_policies')
                ->where('vehicleId', $v->id)
                ->where('type', 'insurance')
                ->orderBy('expiryDate', 'desc')
                ->first();

            $latestTax = DB::table('insurance_policies')
                ->where('vehicleId', $v->id)
                ->where('type', 'road_tax')
                ->orderBy('expiryDate', 'desc')
                ->first();

            $nextService = DB::table('maintenances')
                ->where('vehicleId', $v->id)
                ->where('status', 'scheduled')
                ->orderBy('scheduledDate', 'asc')
                ->first();

            DB::table('vehicles')->where('id', $v->id)->update([
                'insuranceExpiry' => $latestIns?->expiryDate,
                'insurance_policy_no' => $latestIns?->policyNo,
                'insurance_provider' => $latestIns?->provider,
                'insurance_doc_path' => $latestIns?->document_path,
                'roadTaxExpiry' => $latestTax?->expiryDate,
                'road_tax_ref' => $latestTax?->policyNo,
                'road_tax_doc_path' => $latestTax?->document_path,
                'next_service_date' => $nextService?->scheduledDate,
                'next_service_odometer' => $nextService?->nextServiceOdometer,
            ]);
        }

        $drivers = DB::table('drivers')->get();
        foreach ($drivers as $d) {
            $fines = DB::table('fines')->where('driverId', $d->id)->count();
            $accidents = DB::table('accidents')->where('driverId', $d->id)->count();

            DB::table('drivers')->where('id', $d->id)->update([
                'fineCount' => $fines,
                'accidentCount' => $accidents,
            ]);
        }
    }
};
