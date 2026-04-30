<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InsurancePolicy extends Model
{
    protected $fillable = [
        'vehicleId',
        'type',
        'policyNo',
        'provider',
        'startDate',
        'expiryDate',
        'premium',
        'document_path',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicleId');
    }
}
