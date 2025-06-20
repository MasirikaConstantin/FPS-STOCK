<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rapport extends Model
{
    protected $table = 'rapports';

    protected $fillable = [
        'type',
        'hopital_id',
        'periode',
        'genere_par',
        'statut',
        'chemin_fichier',
        'genere_le',
        'mis_a_jour_le',
        'ref'
    ];

    protected $casts = [
        'periode' => 'array',
        'genere_le' => 'datetime',
        'mis_a_jour_le' => 'datetime'
    ];

    public function hopital()
    {
        return $this->belongsTo(Hopital::class, 'hopital_id');
    }

    public function generePar()
    {
        return $this->belongsTo(User::class, 'genere_par');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
