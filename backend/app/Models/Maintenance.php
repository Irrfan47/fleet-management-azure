<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $fillable = [
        'vehicleId',
        'type',
        'scheduledDate',
        'completedDate',
        'odometerAt',
        'nextServiceOdometer',
        'vendor',
        'status',
        'cost',
        'notes',
        'receipt_path',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicleId');
    }
}
