<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $table = 'stocks';

    protected $fillable = [
        'quantite',
        'numero_lot',
        'date_expiration',
        'prix_unitaire',
        'received_date',
        'status',
        'created_by',
        'updated_by',
        'medical_produit_id',
        'hopital_id',
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
