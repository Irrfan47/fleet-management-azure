<?php

namespace App\Http\Controllers;

use App\Models\Driver;
use Illuminate\Http\Request;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Driver::latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:drivers',
            'phone' => 'required|string',
            'licenseNo' => 'required|string|unique:drivers',
            'licenseExpiry' => 'required|date',
            'status' => 'required|string',
            'department' => 'nullable|string',
            'joinedAt' => 'nullable|date',
            'fineCount' => 'nullable|integer',
            'accidentCount' => 'nullable|integer',
            'ic_no' => 'nullable|string',
            'license_type' => 'nullable|string',
            'image_path' => 'nullable|string',
        ]);

        $driver = Driver::create($validated);

        return response()->json($driver, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Driver $driver)
    {
        return response()->json($driver);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Driver $driver)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:drivers,email,' . $driver->id,
            'phone' => 'sometimes|required|string',
            'licenseNo' => 'sometimes|required|string|unique:drivers,licenseNo,' . $driver->id,
            'licenseExpiry' => 'sometimes|required|date',
            'status' => 'sometimes|required|string',
            'department' => 'nullable|string',
            'joinedAt' => 'nullable|date',
            'fineCount' => 'nullable|integer',
            'accidentCount' => 'nullable|integer',
            'ic_no' => 'nullable|string',
            'license_type' => 'nullable|string',
            'image_path' => 'nullable|string',
        ]);

        $driver->update($validated);

        return response()->json($driver);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Driver $driver)
    {
        $driver->delete();
        return response()->json(null, 204);
    }
}
