<?php

namespace App\Http\Controllers;

use App\Models\Accident;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class AccidentController extends Controller
{
    public function index()
    {
        return response()->json(Accident::with(['vehicle', 'driver'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'driverId' => 'required|exists:drivers,id',
            'date' => 'required|date',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'claimStatus' => 'required|string',
            'claimProgress' => 'nullable|integer',
            'estimatedCost' => 'nullable|numeric',
            'report_path' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $accident = Accident::create($validated);
        $vehicle = Vehicle::findOrFail($request->vehicleId);

        // Flowchart 2.4: If accident happens, lock vehicle as 'damaged'
        if ($accident->claimStatus !== 'settled') {
            $vehicle->update(['status' => 'damaged']);
        }

        return response()->json($accident->load(['vehicle', 'driver']), 201);
    }

    public function show(Accident $accident)
    {
        return response()->json($accident->load(['vehicle', 'driver']));
    }

    public function update(Request $request, Accident $accident)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'driverId' => 'sometimes|required|exists:drivers,id',
            'date' => 'sometimes|required|date',
            'location' => 'nullable|string',
            'description' => 'nullable|string',
            'claimStatus' => 'sometimes|required|string',
            'claimProgress' => 'nullable|integer',
            'estimatedCost' => 'nullable|numeric',
            'report_path' => 'nullable|string',
            'images' => 'nullable|array',
        ]);

        $accident->update($validated);
        $vehicle = $accident->vehicle;

        // Flowchart 2.4 Recovery: If settled, assume vehicle is repaired and available
        if ($accident->claimStatus === 'settled') {
            $vehicle->update(['status' => 'available']);
        } else {
            $vehicle->update(['status' => 'damaged']);
        }

        return response()->json($accident->load(['vehicle', 'driver']));
    }

    public function destroy(Accident $accident)
    {
        $vehicle = $accident->vehicle;
        $accident->delete();

        // On deletion, assume vehicle is released
        $vehicle->update(['status' => 'available']);

        return response()->json(null, 204);
    }
}
