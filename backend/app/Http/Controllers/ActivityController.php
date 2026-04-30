<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index()
    {
        return response()->json(Activity::latest()->limit(10)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'message' => 'required|string',
            'user' => 'nullable|string',
        ]);

        $activity = Activity::create($validated);
        return response()->json($activity, 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity);
    }

    public function update(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'type' => 'sometimes|string',
            'message' => 'sometimes|string',
            'user' => 'nullable|string',
        ]);

        $activity->update($validated);
        return response()->json($activity);
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(null, 204);
    }
}
