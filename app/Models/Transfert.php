<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Transfert extends Model
{
    use HasFactory;
    protected $fillable = [
        'from_hospital_id',
        'to_hospital_id',
        'status',
        'priorite',
        'demandeur_id',
        'approbateur_id',
        'notes',
        'approuve_le',
        'livre_le',
        'ref',
        'created_by',
        'updated_by'
    ];
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

    protected $casts = [
        'approuve_le' => 'datetime',
        'livre_le' => 'datetime',
    ];

    public function fromHospital()
    {
        return $this->belongsTo(Hopital::class, 'from_hospital_id');
    }

    public function toHospital()
    {
        return $this->belongsTo(Hopital::class, 'to_hospital_id');
    }

    public function demandeur()
    {
        return $this->belongsTo(User::class, 'demandeur_id');
    }

    public function approbateur()
    {
        return $this->belongsTo(User::class, 'approbateur_id');
    }

    public function articles()
    {
        return $this->hasMany(ArticleTransfert::class);
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

}
