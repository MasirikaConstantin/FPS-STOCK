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
        'specialties',
        'ville',
        'contact_person',
        'is_active',
        'coordonees',
        'created_by',
        'updated_by',
        'ref',
        'contract_start_date',
        'contract_end_date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    protected $casts = [
        'specialties' => 'array',
        'is_active' => 'boolean',
        'contract_start_date' => 'datetime',
        'contract_end_date' => 'datetime'
    ];
    
    protected $attributes = [
        'specialties' => '[]' // Assure que la valeur par défaut est un tableau vide
    ];
}
