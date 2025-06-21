<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;
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
    
    public function medical_produit()
    {
        return $this->belongsTo(MedicalProduit::class);
    }
    public function hopital()
    {
        return $this->belongsTo(Hopital::class);
    }
    public function created_by()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function updated_by()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
