<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Vehicle;
use App\Models\InsurancePolicy;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing insurance and road tax data from vehicles table to insurance_policies table
        $vehicles = Vehicle::all();

        foreach ($vehicles as $vehicle) {
            // Insurance
            if ($vehicle->insuranceExpiry || $vehicle->insurance_policy_no) {
                InsurancePolicy::firstOrCreate([
                    'vehicleId' => $vehicle->id,
                    'type' => 'insurance',
                    'policyNo' => $vehicle->insurance_policy_no ?? 'INITIAL',
                    'expiryDate' => $vehicle->insuranceExpiry ?? now()->addYear()->format('Y-m-d'),
                ], [
                    'provider' => 'Migrated from Vehicle Profile',
                    'startDate' => now()->subYear()->format('Y-m-d'),
                    'premium' => 0,
                ]);
            }

            // Road Tax
            if ($vehicle->roadTaxExpiry) {
                InsurancePolicy::firstOrCreate([
                    'vehicleId' => $vehicle->id,
                    'type' => 'road_tax',
                    'expiryDate' => $vehicle->roadTaxExpiry,
                ], [
                    'policyNo' => 'ROADTAX-' . $vehicle->regNo,
                    'provider' => 'Migrated from Vehicle Profile',
                    'startDate' => now()->subYear()->format('Y-m-d'),
                    'premium' => 0,
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to reverse this without deleting all policies, 
        // but we don't want to delete user-created ones.
    }
};
