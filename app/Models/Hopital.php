<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hopital extends Model
{
    protected $table = 'hopitals';

    protected $fillable = [
        'nom',
        'address',
        'phone',
        'email',
        'type',
        'province',
        'ville',
        'contact_person',
        'capacite',
        'is_active',
        'coordonees',
        'division_administrative_id',
        'created_by',
        'updated_by',
        'ref',
    ];

    public function profils()
    {
        return $this->hasMany(Profil::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }

    public function divisionAdministrative(){
        return $this->belongsTo(DivisionAdministrative::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    
}
