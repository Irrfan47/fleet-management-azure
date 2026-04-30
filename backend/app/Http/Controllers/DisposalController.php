<?php

namespace App\Http\Controllers;

use App\Models\Disposal;
use App\Models\Vehicle;
use App\Models\Activity;
use Illuminate\Http\Request;

class DisposalController extends Controller
{
    public function index()
    {
        return response()->json(Disposal::with('vehicle')->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'reason' => 'required|string',
            'method' => 'required|string',
            'evaluationValue' => 'nullable|numeric',
            'finalValue' => 'nullable|numeric',
            'status' => 'required|string',
            'approvedBy' => 'nullable|string',
            'executedAt' => 'nullable|date',
        ]);

        $disposal = Disposal::create($validated);
        $vehicle = Vehicle::findOrFail($request->vehicleId);

        // Audit Trail (Modul 2.5)
        Activity::create([
            'type' => 'disposal_request',
            'message' => "Disposal request initiated for {$vehicle->regNo} (Method: {$disposal->method})",
            'user' => auth()->user()?->name ?? 'Admin',
        ]);

        return response()->json($disposal->load('vehicle'), 201);
    }

    public function show(Disposal $disposal)
    {
        return response()->json($disposal->load('vehicle'));
    }

    public function update(Request $request, Disposal $disposal)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'reason' => 'sometimes|required|string',
            'method' => 'sometimes|required|string',
            'evaluationValue' => 'nullable|numeric',
            'finalValue' => 'nullable|numeric',
            'status' => 'sometimes|required|string',
            'approvedBy' => 'nullable|string',
            'executedAt' => 'nullable|date',
        ]);

        $oldStatus = $disposal->status;
        $disposal->update($validated);
        $vehicle = $disposal->vehicle;

        // Flowchart 2.5: If approved/completed, lock vehicle forever
        if ($disposal->status === 'completed' || $disposal->status === 'approved') {
            $vehicle->update(['status' => 'disposed']);
            
            // Audit Trail
            if ($oldStatus !== $disposal->status) {
                Activity::create([
                    'type' => 'disposal_approved',
                    'message' => "Disposal APPROVED for {$vehicle->regNo}. Vehicle is now retired from fleet.",
                    'user' => $disposal->approvedBy ?? 'System',
                ]);
            }
        }

        return response()->json($disposal->load('vehicle'));
    }

    public function destroy(Disposal $disposal)
    {
        $vehicle = $disposal->vehicle;
        
        // If it was already disposed, we might want to prevent deletion or keep status
        // For now, allow deletion and reset vehicle if not finalized
        if ($disposal->status !== 'completed' && $disposal->status !== 'approved') {
            $vehicle->update(['status' => 'available']);
        }

        $disposal->delete();
        return response()->json(null, 204);
    }
}
