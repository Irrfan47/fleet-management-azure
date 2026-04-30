<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'licenseNo',
        'license_type',
        'licenseExpiry',
        'status',
        'department',
        'joinedAt',
        'ic_no',
        'image_path',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['fineCount', 'accidentCount'];

    /**
     * Relationship: Fines
     */
    public function fines()
    {
        return $this->hasMany(Fine::class, 'driverId');
    }

    /**
     * Relationship: Accidents
     */
    public function accidents()
    {
        return $this->hasMany(Accident::class, 'driverId');
    }

    /**
     * Accessor for fineCount
     */
    public function getFineCountAttribute()
    {
        return $this->fines()->count();
    }

    /**
     * Accessor for accidentCount
     */
    public function getAccidentCountAttribute()
    {
        return $this->accidents()->count();
    }
}
