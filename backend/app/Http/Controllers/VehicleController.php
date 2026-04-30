<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\Activity;
use App\Models\InsurancePolicy;
use App\Models\Maintenance;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class VehicleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Vehicle::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'regNo' => 'required|string|unique:vehicles',
            'type' => 'required|string',
            'brand' => 'required|string',
            'model' => 'required|string',
            'engine' => 'nullable|string',
            'purchaseDate' => 'nullable|date',
            'status' => 'required|string',
            'location' => 'nullable|string',
            'department' => 'nullable|string',
            'insuranceExpiry' => 'nullable|date',
            'roadTaxExpiry' => 'nullable|date',
            'insurance_policy_no' => 'nullable|string',
            'insurance_provider' => 'nullable|string',
            'insurance_doc_path' => 'nullable|string',
            'road_tax_ref' => 'nullable|string',
            'road_tax_doc_path' => 'nullable|string',
            'class' => 'nullable|string',
            'odometer' => 'required|integer',
            'chassisNo' => 'nullable|string|unique:vehicles',
            'image_path' => 'nullable|string',
            'capacity' => 'nullable|string',
            'load' => 'nullable|string',
            'next_service_date' => 'nullable|date',
            'next_service_odometer' => 'nullable|integer',
        ]);

        return \DB::transaction(function () use ($validated, $request) {
            // Extract relational data that no longer exists in the vehicles table
            $complianceData = Arr::only($validated, [
                'insuranceExpiry', 'roadTaxExpiry', 'insurance_policy_no', 
                'insurance_provider', 'insurance_doc_path', 
                'road_tax_ref', 'road_tax_doc_path'
            ]);

            $maintenanceData = Arr::only($validated, [
                'next_service_date', 'next_service_odometer'
            ]);

            // Create vehicle without the relational fields
            $vehicle = Vehicle::create(Arr::except($validated, array_merge(array_keys($complianceData), array_keys($maintenanceData))));

            // 1. Create Insurance Policy if data exists
            if (!empty($complianceData['insuranceExpiry']) || !empty($complianceData['insurance_policy_no'])) {
                InsurancePolicy::create([
                    'vehicleId' => $vehicle->id,
                    'type' => 'insurance',
                    'policyNo' => $complianceData['insurance_policy_no'] ?? 'TBA',
                    'provider' => $complianceData['insurance_provider'] ?? 'TBA',
                    'startDate' => now()->format('Y-m-d'),
                    'expiryDate' => $complianceData['insuranceExpiry'] ?? now()->addYear()->format('Y-m-d'),
                    'premium' => 0,
                    'document_path' => $complianceData['insurance_doc_path'] ?? null,
                ]);
            }

            // 2. Create Road Tax if data exists
            if (!empty($complianceData['roadTaxExpiry'])) {
                InsurancePolicy::create([
                    'vehicleId' => $vehicle->id,
                    'type' => 'road_tax',
                    'policyNo' => $complianceData['road_tax_ref'] ?? ('ROADTAX-' . $vehicle->regNo),
                    'provider' => 'JPJ',
                    'startDate' => now()->format('Y-m-d'),
                    'expiryDate' => $complianceData['roadTaxExpiry'],
                    'premium' => 0,
                    'document_path' => $complianceData['road_tax_doc_path'] ?? null,
                ]);
            }

            // 3. Create Maintenance if data exists
            if (!empty($maintenanceData['next_service_date']) || !empty($maintenanceData['next_service_odometer'])) {
                Maintenance::create([
                    'vehicleId' => $vehicle->id,
                    'type' => 'service',
                    'scheduledDate' => $maintenanceData['next_service_date'] ?? now()->addMonth()->format('Y-m-d'),
                    'nextServiceOdometer' => $maintenanceData['next_service_odometer'] ?? ($vehicle->odometer + 5000),
                    'status' => 'scheduled',
                ]);
            }

            Activity::log("New vehicle added: {$vehicle->regNo} ({$vehicle->brand} {$vehicle->model})", 'vehicle', $request->user()?->name ?? 'Admin');

            return response()->json($vehicle, 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'regNo' => 'sometimes|required|string|unique:vehicles,regNo,' . $vehicle->id,
            'type' => 'sometimes|required|string',
            'brand' => 'sometimes|required|string',
            'model' => 'sometimes|required|string',
            'engine' => 'nullable|string',
            'purchaseDate' => 'nullable|date',
            'status' => 'sometimes|required|string',
            'location' => 'nullable|string',
            'department' => 'nullable|string',
            'class' => 'nullable|string',
            'odometer' => 'sometimes|required|integer',
            'chassisNo' => 'nullable|string|unique:vehicles,chassisNo,' . $vehicle->id,
            'image_path' => 'nullable|string',
            'capacity' => 'nullable|string',
            'load' => 'nullable|string',
        ]);

        $oldStatus = $vehicle->status;
        $oldImage = $vehicle->image_path;
        
        $vehicle->update($validated);

        // Cleanup: If image changed, delete old file
        if ($oldImage && $oldImage !== $vehicle->image_path) {
            $this->deletePhysicalFile($oldImage);
        }

        if ($oldStatus !== $vehicle->status) {
            Activity::log("Vehicle {$vehicle->regNo} status updated from {$oldStatus} to {$vehicle->status}", 'vehicle', $request->user()?->name ?? 'Admin');
        }

        return response()->json($vehicle);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $image = $vehicle->image_path;
        $vehicle->delete();

        if ($image) {
            $this->deletePhysicalFile($image);
        }

        return response()->json(null, 204);
    }

    private function deletePhysicalFile($path)
    {
        $fullPath = public_path(ltrim($path, '/'));
        if (file_exists($fullPath) && is_file($fullPath)) {
            unlink($fullPath);
        }
    }
}
