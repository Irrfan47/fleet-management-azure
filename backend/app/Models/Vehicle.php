<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'regNo',
        'type',
        'brand',
        'model',
        'engine',
        'purchaseDate',
        'status',
        'location',
        'department',
        'class',
        'odometer',
        'chassisNo',
        'image_path',
        'capacity',
        'load',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = [
        'insurance_policy_no',
        'insurance_provider',
        'insurance_doc_path',
        'insuranceExpiry',
        'road_tax_ref',
        'road_tax_doc_path',
        'roadTaxExpiry',
        'next_service_date',
        'next_service_odometer'
    ];

    /* ── Compliance Accessors ────────────────────────────────── */

    public function getLatestInsurance()
    {
        return $this->insurancePolicies()
            ->where('type', 'insurance')
            ->latest('expiryDate')
            ->first();
    }

    public function getLatestRoadTax()
    {
        return $this->insurancePolicies()
            ->where('type', 'road_tax')
            ->latest('expiryDate')
            ->first();
    }

    public function getLatestMaintenance()
    {
        return $this->maintenances()
            ->where('status', 'scheduled')
            ->latest('scheduledDate')
            ->first();
    }

    public function getInsurancePolicyNoAttribute()
    {
        return $this->getLatestInsurance()?->policyNo;
    }

    public function getInsuranceProviderAttribute()
    {
        return $this->getLatestInsurance()?->provider;
    }

    public function getInsuranceDocPathAttribute()
    {
        return $this->getLatestInsurance()?->document_path;
    }

    public function getInsuranceExpiryAttribute()
    {
        return $this->getLatestInsurance()?->expiryDate;
    }

    public function getRoadTaxRefAttribute()
    {
        return $this->getLatestRoadTax()?->policyNo;
    }

    public function getRoadTaxDocPathAttribute()
    {
        return $this->getLatestRoadTax()?->document_path;
    }

    public function getRoadTaxExpiryAttribute()
    {
        return $this->getLatestRoadTax()?->expiryDate;
    }

    public function getNextServiceDateAttribute()
    {
        return $this->getLatestMaintenance()?->scheduledDate;
    }

    public function getNextServiceOdometerAttribute()
    {
        return $this->getLatestMaintenance()?->nextServiceOdometer;
    }

    /**
     * Relationship: Insurance Policies & Road Tax
     */
    public function insurancePolicies()
    {
        return $this->hasMany(InsurancePolicy::class, 'vehicleId');
    }

    /**
     * Relationship: Maintenances
     */
    public function maintenances()
    {
        return $this->hasMany(Maintenance::class, 'vehicleId');
    }

    /**
     * Relationship: Bookings
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'vehicleId');
    }

    /**
     * Relationship: Accidents
     */
    public function accidents()
    {
        return $this->hasMany(Accident::class, 'vehicleId');
    }

    /**
     * Relationship: Fines
     */
    public function fines()
    {
        return $this->hasMany(Fine::class, 'vehicleId');
    }
}
