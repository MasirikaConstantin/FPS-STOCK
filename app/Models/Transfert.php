<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transfert extends Model
{
    protected $fillable = [
        'from_hospital_id',
        'to_hospital_id',
        'status',
        'priorité',
        'demander_par',
        'approuver_par',
        'notes',
        'approuver__le',
        'delivrer_le',
        'ref'
    ];

    protected $casts = [
        'approuver__le' => 'datetime',
        'delivrer_le' => 'datetime',
    ];
    public function fromHospital()
    {
        return $this->belongsTo(Hopital::class, 'from_hospital_id');
    }
    public function toHospital()
    {
        return $this->belongsTo(Hopital::class, 'to_hospital_id');
    }
    public function demanderPar()
    {
        return $this->belongsTo(User::class, 'demander_par');
    }
    public function approuverPar()
    {
        return $this->belongsTo(User::class, 'approuver_par');
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
