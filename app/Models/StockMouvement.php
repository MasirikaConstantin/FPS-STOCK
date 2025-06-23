<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockMouvement extends Model
{
    protected $fillable = [
        'type',
        'quantite',
        'raison',
        'notes',
        'medical_produit_id',
        'hopital_id',
        'created_by',
        'updated_by',
        'transfert_id',
        'ref'
    ];
    protected $casts = [
        'quantite' => 'integer',
        'type' => 'string',
        'raison' => 'string',
        'notes' => 'string',
        'ref' => 'string',
    ];
    protected $table = 'stock_mouvements';
    public function medicalProduit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }
    public function hopital()
    {
        return $this->belongsTo(Hopital::class);
    }
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
        });
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
}
