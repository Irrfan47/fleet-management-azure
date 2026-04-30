<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'type',
        'message',
        'user',
    ];

    public static function log($message, $type = 'info', $user = 'System')
    {
        return self::create([
            'message' => $message,
            'type' => $type,
            'user' => $user,
        ]);
    }
}
