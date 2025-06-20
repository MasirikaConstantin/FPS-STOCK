<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class DivisionAdministrave extends Model
{
    protected $fillable = [
        'nom',
        'type',
        "parent_id",
        'is_active',
        'ref',
    ];
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            $model->ref = Str::uuid();
        });
    }
}
