<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $table = 'fournisseurs';

    protected $fillable = [
        'nom',
        'address',
        'phone',
        'email',
        'type',
        'province',
        'ville',
        'contact_person',
        'is_active',
        'coordonees',
        'created_by',
        'updated_by',
        'ref',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
