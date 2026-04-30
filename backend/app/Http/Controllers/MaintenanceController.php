<?php

namespace App\Http\Controllers;

use App\Models\Maintenance;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    public function index()
    {
        return response()->json(Maintenance::with('vehicle')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'type' => 'required|string',
            'scheduledDate' => 'required|date',
            'completedDate' => 'nullable|date',
            'odometerAt' => 'nullable|integer',
            'nextServiceOdometer' => 'nullable|integer',
            'vendor' => 'nullable|string',
            'status' => 'required|string',
            'cost' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'receipt_path' => 'nullable|string',
        ]);

        $maintenance = Maintenance::create($validated);
        $vehicle = Vehicle::findOrFail($request->vehicleId);

        // Flowchart 2.2: If maintenance is pending/in-progress, lock vehicle
        if ($maintenance->status !== 'completed' && $maintenance->status !== 'cancelled') {
            $vehicle->update(['status' => 'maintenance']);
        }

        return response()->json($maintenance->load('vehicle'), 201);
    }

    public function show(Maintenance $maintenance)
    {
        return response()->json($maintenance->load('vehicle'));
    }

    public function update(Request $request, Maintenance $maintenance)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'type' => 'sometimes|required|string',
            'scheduledDate' => 'sometimes|required|date',
            'completedDate' => 'nullable|date',
            'odometerAt' => 'nullable|integer',
            'nextServiceOdometer' => 'nullable|integer',
            'vendor' => 'nullable|string',
            'status' => 'sometimes|required|string',
            'cost' => 'nullable|numeric',
            'notes' => 'nullable|string',
            'receipt_path' => 'nullable|string',
        ]);

        $maintenance->update($validated);
        $vehicle = $maintenance->vehicle;

        // Recovery logic: If finished, make vehicle available
        if ($maintenance->status === 'completed' || $maintenance->status === 'cancelled') {
            $vehicle->update(['status' => 'available']);
        } else {
            $vehicle->update(['status' => 'maintenance']);
        }

        return response()->json($maintenance->load('vehicle'));
    }

    public function destroy(Maintenance $maintenance)
    {
        $vehicle = $maintenance->vehicle;
        $maintenance->delete();

        // If an active maintenance record is deleted, check if vehicle can be available
        // Simple logic: return to available
        $vehicle->update(['status' => 'available']);

        return response()->json(null, 204);
    }
}
