<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function index()
    {
        return response()->json(Fine::with(['vehicle', 'driver'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'driverId' => 'required|exists:drivers,id',
            'offence' => 'required|string',
            'amount' => 'required|numeric',
            'date' => 'required|date',
            'status' => 'required|string',
            'ticketNo' => 'required|string',
        ]);

        $fine = Fine::create($validated);
        return response()->json($fine->load(['vehicle', 'driver']), 201);
    }

    public function show(Fine $fine)
    {
        return response()->json($fine->load(['vehicle', 'driver']));
    }

    public function update(Request $request, Fine $fine)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'driverId' => 'sometimes|required|exists:drivers,id',
            'offence' => 'sometimes|required|string',
            'amount' => 'sometimes|required|numeric',
            'date' => 'sometimes|required|date',
            'status' => 'sometimes|required|string',
            'ticketNo' => 'sometimes|required|string',
        ]);

        $fine->update($validated);
        return response()->json($fine->load(['vehicle', 'driver']));
    }

    public function destroy(Fine $fine)
    {
        $fine->delete();
        return response()->json(null, 204);
    }
}
