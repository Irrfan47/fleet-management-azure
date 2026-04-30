<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    protected $fillable = [
        'vehicleId',
        'driverId',
        'offence',
        'amount',
        'date',
        'status',
        'ticketNo',
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
