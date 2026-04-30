<?php

namespace App\Http\Controllers;

use App\Models\InsurancePolicy;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class InsurancePolicyController extends Controller
{
    public function index()
    {
        return response()->json(InsurancePolicy::with('vehicle')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'type' => 'required|string',
            'policyNo' => 'required|string',
            'provider' => 'required|string',
            'startDate' => 'required|date',
            'expiryDate' => 'required|date',
            'premium' => 'nullable|numeric',
            'document_path' => 'nullable|string',
        ]);

        $policy = InsurancePolicy::create($validated);

        return response()->json($policy->load('vehicle'), 201);
    }

    public function show(InsurancePolicy $insurancePolicy)
    {
        return response()->json($insurancePolicy->load('vehicle'));
    }

    public function update(Request $request, InsurancePolicy $insurancePolicy)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'type' => 'sometimes|required|string',
            'policyNo' => 'sometimes|required|string',
            'provider' => 'sometimes|required|string',
            'startDate' => 'sometimes|required|date',
            'expiryDate' => 'sometimes|required|date',
            'premium' => 'nullable|numeric',
            'document_path' => 'nullable|string',
        ]);

        $oldPath = $insurancePolicy->document_path;
        $insurancePolicy->update($validated);

        // Cleanup: If path changed, delete old file
        if ($oldPath && $oldPath !== $insurancePolicy->document_path) {
            $this->deletePhysicalFile($oldPath);
        }

        return response()->json($insurancePolicy->load('vehicle'));
    }

    public function destroy(InsurancePolicy $insurancePolicy)
    {
        $path = $insurancePolicy->document_path;
        $insurancePolicy->delete();

        if ($path) {
            $this->deletePhysicalFile($path);
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
