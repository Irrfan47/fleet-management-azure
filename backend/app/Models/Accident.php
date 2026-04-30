<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accident extends Model
{
    protected $fillable = [
        'vehicleId',
        'driverId',
        'date',
        'location',
        'description',
        'claimStatus',
        'claimProgress',
        'estimatedCost',
        'report_path',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicleId');
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class, 'driverId');
    }
}
