<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'vehicleId',
        'driverId',
        'startDate',
        'endDate',
        'purpose',
        'status',
        'destination',
        'odometerStart',
        'odometerEnd',
        'checkInAt',
        'checkOutAt',
        'notes',
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
