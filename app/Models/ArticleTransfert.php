<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleTransfert extends Model
{
    protected $fillable = [
        'source_location_id',
        'destination_location_id',
        'quantite',
        'medical_produit_id',
        'transfert_id',
        'created_by',
        'updated_by',
        'ref'
    ];

    public function sourceLocation()
    {
        return $this->belongsTo(Hopital::class, 'source_location_id');
    }

    public function destinationLocation()
    {
        return $this->belongsTo(Hopital::class, 'destination_location_id');
    }

    public function medicalProduit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }

    public function transfert()
    {
        return $this->belongsTo(Transfert::class);
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
    }
}
