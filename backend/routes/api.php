<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\MaintenanceController;
use App\Http\Controllers\InsurancePolicyController;
use App\Http\Controllers\AccidentController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\DisposalController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UploadController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/view-file', [UploadController::class, 'view']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/upload', [UploadController::class, 'upload']);

    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('drivers', DriverController::class);
    Route::apiResource('bookings', BookingController::class);
    Route::apiResource('maintenances', MaintenanceController::class);
    Route::apiResource('insurance-policies', InsurancePolicyController::class);
    Route::apiResource('accidents', AccidentController::class);
    Route::apiResource('fines', FineController::class);
    Route::apiResource('disposals', DisposalController::class);
    Route::apiResource('activities', ActivityController::class);
});
