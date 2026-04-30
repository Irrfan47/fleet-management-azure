<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Vehicle;
use App\Models\Driver;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(Booking::with(['vehicle', 'driver'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'vehicleId' => 'required|exists:vehicles,id',
            'driverId' => 'required|exists:drivers,id',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'purpose' => 'required|string',
            'status' => 'required|string',
            'destination' => 'nullable|string',
            'odometerStart' => 'nullable|integer',
            'odometerEnd' => 'nullable|integer|gt:odometerStart',
            'checkInAt' => 'nullable|date',
            'checkOutAt' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $vehicle = Vehicle::findOrFail($request->vehicleId);
        $driver = Driver::findOrFail($request->driverId);

        // 1. Check if Driver is Active (Flowchart 2.1)
        if ($driver->status !== 'active') {
            throw ValidationException::withMessages([
                'driverId' => ['Selected driver is not currently active.'],
            ]);
        }

        // 2. Check if Vehicle is Available (Flowchart 2.1)
        if ($vehicle->status !== 'available' && $request->status !== 'cancelled') {
            throw ValidationException::withMessages([
                'vehicleId' => ['Selected vehicle is not available (Current status: ' . $vehicle->status . ').'],
            ]);
        }

        $booking = Booking::create($validated);

        // 3. Update Vehicle Status if booking is active/started
        if ($booking->status === 'confirmed' || $booking->status === 'in-use') {
            $vehicle->update(['status' => 'in-use']);
        }

        Activity::log("Booking created for {$vehicle->regNo} by {$driver->name}", 'booking', $request->user()?->name ?? 'Admin');

        return response()->json($booking->load(['vehicle', 'driver']), 201);
    }

    public function show(Booking $booking)
    {
        return response()->json($booking->load(['vehicle', 'driver']));
    }

    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'vehicleId' => 'sometimes|required|exists:vehicles,id',
            'driverId' => 'sometimes|required|exists:drivers,id',
            'startDate' => 'sometimes|required|date',
            'endDate' => 'sometimes|required|date|after_or_equal:startDate',
            'purpose' => 'sometimes|required|string',
            'status' => 'sometimes|required|string',
            'destination' => 'nullable|string',
            'odometerStart' => 'nullable|integer',
            'odometerEnd' => 'nullable|integer|gte:odometerStart',
            'checkInAt' => 'nullable|date',
            'checkOutAt' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $booking->status;
        $booking->update($validated);
        $vehicle = $booking->vehicle;

        // Update Vehicle Status based on Booking Lifecycle
        if ($booking->status === 'completed' || $booking->status === 'cancelled') {
            $vehicle->update(['status' => 'available']);
        } elseif ($booking->status === 'in-use' && $oldStatus !== 'in-use') {
            $vehicle->update(['status' => 'in-use']);
        }

        Activity::log("Booking {$booking->id} status updated to {$booking->status}", 'booking', $request->user()?->name ?? 'Admin');

        return response()->json($booking->load(['vehicle', 'driver']));
    }

    public function destroy(Booking $booking)
    {
        $vehicle = $booking->vehicle;
        $booking->delete();
        
        // If an active booking is deleted, make vehicle available again
        if ($booking->status === 'in-use' || $booking->status === 'confirmed') {
            $vehicle->update(['status' => 'available']);
        }

        return response()->json(null, 204);
    }
}
