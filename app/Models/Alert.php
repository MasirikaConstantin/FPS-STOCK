<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $fillable = [
        'type',
        'message',
        'is_read',
        'user_id',
        'ref'
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'type' => 'string',
        'message' => 'string',
        'ref' => 'string',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
