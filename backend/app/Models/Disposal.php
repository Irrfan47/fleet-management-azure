<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disposal extends Model
{
    protected $fillable = [
        'vehicleId',
        'reason',
        'method',
        'evaluationValue',
        'finalValue',
        'status',
        'approvedBy',
        'executedAt',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicleId');
    }
}
